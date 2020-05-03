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

const io = socketio(server);

// Run when client connects
// io.on("connection", (socket) => {
// socket.on("userStatus", (user) => {
//   // let frontend know if user has already joined the room
//   const room = getCurrentRoom(user.room);
//   const messages = room ? room.messages : [];
//   socket.emit("joined", messages);
// });
// socket.on("joinRoom", (user, callback) => {
//   if (!userAlreadyJoined(user)) {
//     roomJoin({ id: socket.id, ...user });
//     socket.join(user.room);
//     // Welcome current user
//     socket.emit("message", formatMessage(`Welcome to ${user.room}`, "admin"));
//     // Broadcast when a user connects
//     socket.broadcast
//       .to(user.room)
//       .emit(
//         "message",
//         formatMessage(`${user.username} has joined the chat`, "admin")
//       );

//     // Send users and room info
//     io.to(user.room).emit("roomUsers", {
//       room: user.room,
//       users: getRoomUsers(user.room),
//     });
//   }
//   callback();
// });

// // // Listen for chatMessage
// socket.on("chatMessage", (msg, callback) => {
//   const room = getCurrentRoom(msg.room);
//   io.to(room.name).emit("message", formatMessage(msg));
//   callback();
// });

// // Runs when client disconnects
// socket.on("disconnect", () => {
//   const user = userLeave(socket.id);

//   if (user) {
//     io.to(user.room).emit(
//       "message",
//       formatMessage(`${user.username} has left the chat`)
//     );

//     // Send users and room info
//     io.to(user.room).emit("roomUsers", {
//       room: user.room,
//       users: getRoomUsers(user.room),
//     });
//   }
// });
// });
