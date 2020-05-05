import express from "express";
import path from "path";
import http from "http";
import bodyParser from "body-parser";
import logger from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import config from "./config";
import routes from "./routes";
import socketio from "socket.io";
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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
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
    if (!rooms.includes(room)) {
      socket.join(room, () => {
        socket.emit(
          "messages",
          formatMessage(
            { username, room, message: `Welcome to the ${room} room.` },
            "admin"
          )
        );
        socket
          .to(room)
          .emit(
            "messages",
            formatMessage(
              { username, room, message: `${username} has joined.` },
              "admin"
            )
          );
      });
      callback(Object.keys(socket.rooms));
    } else {
      callback("User has aleady joined the chat room");
    }
  });

  console.log("Connected");
  socket.on("disconnect", console.log);

  socket.on("message", (msg) => {
    io.emit("messages", formatMessage(msg));
  });

  socket.on("typing", (data) => {
    const message = data.active ? `${data.username} is typing ...` : null;
    socket.to(data.room).emit("typing", { ...data, message });
  });
}
const io = socketio(server);
io.on("connection", handleIO);
