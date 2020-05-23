const moment = require("moment");
import Group from "../models/group.model";
import User from "../models/user.model";
import Room from "../models/room.model";
import { formatMessage, logger } from "../helpers";
import chalk from "chalk";

/* core functions */
/* helper functions */

function welcomeMessage(socket) {
  try {
    socket.emit("welcome", "Welcome to the room");
  } catch (err) {
    console.log(err);
  }
}

function joinMessage(socket, user, roomId) {
  try {
    socket
      .to(roomId)
      .emit("newUserjoined", `${user.username} has joined the chat.`);
  } catch (err) {
    console.log(err);
  }
}

function updateUserList(socket, user, roomId) {
  try {
    socket.to(roomId).emit("updateUser", user);
  } catch (err) {
    console.log(err);
  }
}

// function startAllSession(user, callback) {
//   try {
//     let { rooms, groups, friends } = user;
//     groups = groups.filter((group) => group.request.status === "approved");
//     friends = friends.filter((friend) => friend.status === "approved");

//     rooms.length &&
//       rooms.forEach((room) => {
//         socket.join(room.room.name);
//       });
//     group.length &&
//       groups.forEach((group) => {
//         socket.join(group.group.name);
//       });
//     friends.length &&
//       friends.forEach((friend) => {
//         socket.join(friend.friend.username);
//       });
//     callback(null, socket.rooms);
//   } catch (err) {
//     callback(err);
//   }
// }
function onJoin(socket, { roomId, user }) {
  try {
    const exists = Object.keys(socket.rooms).includes(roomId);
    if (!exists) {
      socket.join(roomId, () => {
        updateUserList(socket, user, roomId);
        joinMessage(socket, user, roomId);
        welcomeMessage(socket);
      });
    }
  } catch (err) {
    console.log(err);
  }
  // socket.join(room.name, () => {
  //   const message = formatMessage({
  //     from: { name: room.name },
  //     to: { name: room.name },
  //     message: {
  //       text: `Welcome to the ${room.name} room.`,
  //       type: "text",
  //     },
  //   });
  //   socket.emit("messages", message);
  //   socket.to(room.name).emit(
  //     "messages",
  //     formatMessage({
  //       from: { name: room.name },
  //       to: { name: room.name },
  //       message: {
  //         text: `${user.username} has joined.`,
  //         type: "text",
  //       },
  //     })
  //   );
  //   socket.to(room.name).emit("updateUsers", { user, entity });
  // });
}
function leave() {}

function onMessage(socket, msg) {
  try {
    socket.to(msg.receiver.id).emit("messages", formatMessage(msg));
  } catch (err) {
    console.log(err);
  }
}

function onTyping(socket, msg) {
  try {
    const { active, sender } = msg;
    const message = active ? `${sender} is typing ...` : null;
    socket.to(msg.receiver).emit("typing", { ...msg, message });
  } catch (err) {
    console.log(err);
  }
}

function onDisconnect(socket) {
  console.log("Disconnected:", socket);
}

function onError(error) {
  console.log("Erron on socket:", error);
}

function onChat(socket, msg) {
  socket.emit("chat", msg);
}

// class SocketIO {
//   constructor() {
//     this.socket = null;
//     this.io = null;
//   }
//   init(socket, io) {
//     logger(`Socket ID: ${socket.id}`);
//     this.socket = socket;
//     this.io = io;
//     socket.on("chat", () => onChat(msg, io));
//     // this.socket.on("message", onMessage);
//     // this.socket.on("join", (msg) => handleJoin(socket, msg));
//     socket.on("typing", function (msg) {
//       onTyping(socket, msg);
//     });
//     socket.on("error", onError);
//     socket.on("disconnect", onDisconnect);
//   }

//   handleJoin(msg) {
//     onJoin(this.socket, msg);
//   }
//   handleMessage(msg) {
//     onMessage(this.socket, msg);
//   }
//   // startAllSession,
// }

function handleSocketIO(socket) {
  socket.on("chat", (msg) => onChat(socket, msg));
  socket.on("typing", (msg) => onTyping(socket, msg));
  socket.on("message", (msg) => onMessage(socket, message));
  socket.on("error", onError);
  socket.on("disconnect", onDisconnect);
}
