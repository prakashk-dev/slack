import "source-map-support/register";

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
import {
  roomJoin,
  getCurrentRoom,
  // userLeave,
  getRoomUsers,
  userAlreadyJoined,
} from "./helpers/room";

import formatMessage from "./helpers/message";

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

app.use("/api", routes);
app.use("/api/config", (req, res) => {
  return res.json({
    SOCKET_URL:
      process.env.NODE_ENV === "production"
        ? "https://socket.bhet-ghat.com"
        : `http://localhost:3001`,
  });
});

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
    if (err instanceof multer.MulterError) {
      return res.json({
        message: "Somethign went wrong from multer",
        error: err,
      });
    } else if (err) {
      return res.json({ message: "Somethign went wrong", error: err });
    }
    // /use/app comes from docker
    const image = req.file.path.replace("/usr/app", "/api");
    return res.json({ image: image });
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

function handleIO(socket) {
  socket.on("join", (data, callback) => {
    const { room, username } = data;
    const rooms = Object.keys(socket.rooms);
    console.log("Your rooms: ", rooms);
    if (!rooms.includes(room)) {
      socket.join(room, () => {
        const message = formatMessage({
          ...data,
          message: `Welcome to the ${room} room.`,
        });
        socket.emit("messages", message);
        socket
          .to(room)
          .emit(
            "messages",
            formatMessage({ ...data, message: `${username} has joined.` })
          );
      });
      callback(`Users rooms: ${Object.keys(socket.rooms)}`);
    } else {
      callback(`User has aleady joined the chat room ${room}`);
    }
  });

  console.log("Connected");
  socket.on("disconnecting", console.log);
  socket.on("error", console.log);
  socket.on("disconnect", console.log);

  // for react native
  socket.on("chat", (msg) => {
    io.emit("chat", msg);
  });

  socket.on("message", (msg) => {
    socket.broadcast.emit("messages", formatMessage(msg));
  });

  socket.on("typing", (data) => {
    const message = data.active ? `${data.username} is typing ...` : null;
    socket.to(data.room).emit("typing", { ...data, message });
  });
}
const io = socketio(server);
io.on("connection", handleIO);
