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
console.log("************************************");
console.log("mongoose", mongoose.connection.readyState);
console.log("************************************");
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    server: { socketOptions: { keepAlive: 1 } },
  })
  .catch((err) => console.log(err.message));
console.log("************************************");
console.log("mongoose", mongoose.connection.readyState);
console.log("************************************");
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

function handleIO(socket) {
  socket.on("join", (username, callback) => {
    callback({ username, socketId: socket.id });
    socket.emit(
      "messages",
      formatMessage({ username, message: "Welcome to the Bhet Ghat" }, "admin")
    );
    socket.broadcast.emit(
      "messages",
      formatMessage(
        { username, message: `${username} has joined the chat.` },
        "admin"
      )
    );
  });

  console.log("Connected");
  socket.on("disconnect", console.log);

  socket.on("message", (msg) => {
    io.emit("messages", formatMessage(msg));
  });
}
const io = socketio(server);
io.on("connection", handleIO);
