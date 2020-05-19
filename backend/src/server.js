if (process.env.NODE_ENV !== "production") {
  console.log("requiring");
}
require("source-map-support/register");
import express from "express";
import path from "path";
import http from "http";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import config from "./config";
import routes from "./routes";
import socketio from "socket.io";
import multer from "multer";
import fs from "fs";
import { seedData, unSeedData } from "./test-data/data";
import Group from "./models/group.model";
import User from "./models/user.model";
import Room from "./models/room.model";
const moment = require("moment");

import {
  roomJoin,
  getCurrentRoom,
  // userLeave,
  getRoomUsers,
  userAlreadyJoined,
} from "./helpers/room";

import formatMessage from "./helpers/message";
import { kMaxLength } from "buffer";

const app = express();
const server = http.createServer(app);

const mongoUri = config.mongo.host;
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    server: { socketOptions: { keepAlive: 1 } },
  })
  .catch((err) => console.log(err.message));
// import dummy data

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/static", express.static(path.join(__dirname, "../static")));

if (config.env === "development") {
  app.use(logger("dev"));
}

app.use("/api/config", (req, res) => {
  return res.json({
    SOCKET_URL:
      process.env.NODE_ENV === "production"
        ? "https://socket.bhet-ghat.com"
        : `http://localhost:3001`,
  });
});

app.use("/api", routes);
// create a route with only admin access, for now this will work
app.get("/api/seed", async (req, res) => {
  const result = await seedData();
  return res.json(result);
});
app.get("/api/unseed", async (req, res) => {
  const result = await unSeedData();
  return res.json(result);
});

const imageDir = () => path.join(__dirname, `../static/images`);

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = req.body.room
      ? `${imageDir()}/${req.body.room}`
      : `${imageDir()}/undefined-room`;

    !fs.existsSync(dest) && fs.mkdirSync(dest);
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage }).single("file");

app.post("/api/upload", (req, res, next) => {
  upload(req, res, (err) => {
    try {
      if (err instanceof multer.MulterError) {
        return res.json({
          message: "Somethign went wrong from multer",
          error: err,
        });
      } else if (err) {
        return res.json({ message: "Somethign went wrong", error: err });
      }
      // /use/app comes from docker
      const url = req.file.path.replace("/usr/app", "/api");
      return res.json({ url });
    } catch (error) {
      console.log("Error", error.message);
      return res.json({ error: error.message });
    }
  });
});

const port = process.env.PORT || "8080";

server.listen(port, () => {
  console.log(
    `Application is running on Env: ${process.env.NODE_ENV} in port ${port}`
  );
});

app.get("/", (req, res) => {
  return res.json({ msg: "Socket is up and running" });
});
let $socket, $io;
function handleIO(socket) {
  $socket = socket;
  socket.on("error", console.log);
  socket.on("disconnect", (socket) => {
    // remove user from that room
  });

  // for react native
  socket.on("chat", (msg) => {
    io.emit("chat", msg);
  });

  socket.on("message", (msg) => {
    const { from, to, message } = msg;
    // // save message to the databse
    const formattedMessage = {
      from: from._id,
      to: to._id,
      message,
      timeStamp: moment.utc().format(),
    };
    const Modal = to.room ? Room : to.group ? Group : User;
    Modal.findOneAndUpdate(
      { _id: to._id },
      { $addToSet: { messages: [formattedMessage] } },
      (err, res) => {
        if (err) throw err;
        socket.broadcast.emit("messages", formatMessage(msg));
      }
    );
  });

  socket.on("typing", (data) => {
    const { active, username } = data;
    const message = active ? `${username} is typing ...` : null;
    const room = data.room || data.user || data.group;
    socket.to(room).emit("typing", { ...data, message });
  });
}
const io = socketio(server);
io.on("connection", handleIO);

$io = io;

export { $socket, $io };
