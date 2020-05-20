const moment = require("moment");
import Group from "../models/group.model";
import User from "../models/user.model";
import Room from "../models/room.model";
import { formatMessage, logger } from "../helpers";
import chalk from "chalk";

let socket, io;
/* core functions */
/* helper functions */
function initSocket() {}

function welcomeMessage() {}

function joinMessage() {}

function updateUserList() {}

function handleJoin(user, room, entity) {
  socket.join(room.name, () => {
    const message = formatMessage({
      from: { name: room.name },
      to: { name: room.name },
      message: {
        text: `Welcome to the ${room.name} room.`,
        type: "text",
      },
    });
    socket.emit("messages", message);
    socket.to(room.name).emit(
      "messages",
      formatMessage({
        from: { name: room.name },
        to: { name: room.name },
        message: {
          text: `${user.username} has joined.`,
          type: "text",
        },
      })
    );
    socket.to(room.name).emit("updateUsers", { user, entity });
  });
}
function leave() {}

function broadcast() {}
function broadcastToOthers() {}
function emitToMyself() {}

async function onMessage(msg) {
  const { to } = msg;
  // // save message to the databse
  logger(msg);
  const Modal = to.room ? Room : to.group ? Group : User;
  const receiver = to.room ? "room" : to.group ? "group" : "user";
  // here we need to push to the group as well as message document
  try {
    const result = await Modal.findById(to[receiver]._id).exec();
    if (result) {
      logger(result);
      result.messages.push(msg);
      await result.save();
      socket.broadcast.emit("messages", formatMessage(msg));
    }
  } catch (err) {
    console.log(chalk.red(err));
  }
}

function onTyping(msg) {
  const { active, username } = msg;
  const message = active ? `${username} is typing ...` : null;
  const room = msg.room || msg.user || msg.group;
  socket.to(room).emit("typing", { ...msg, message });
}

function onDisconnect(socket) {
  console.log("Disconnected:", socket);
}

function onError(error) {
  console.log("Erron on socket:", error);
}

function onChat(msg, io) {
  io.emit("chat", msg);
}

function handleIO(soc, i) {
  socket = soc;
  io = i;
  // for react native
  socket.on("chat", () => onChat(msg, io));
  socket.on("message", onMessage);
  // socket.on("join", (msg) => handleJoin(socket, msg));
  socket.on("typing", onTyping);
  socket.on("error", onError);
  socket.on("disconnect", onDisconnect);
}

export {
  initSocket,
  welcomeMessage,
  joinMessage,
  updateUserList,
  handleJoin,
  leave,
  onMessage,
  onTyping,
  onError,
  handleIO,
};
