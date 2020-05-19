const moment = require("moment");
import Group from "../models/group.model";
import User from "../models/user.model";
import Room from "../models/room.model";
import { formatMessage } from "../helpers";

/* core functions */
/* helper functions */
function initSocket() {}

function welcomeMessage() {}

function joinMessage() {}

function updateUserList() {}
function join() {}
function leave() {}

function broadcast() {}
function broadcastToOthers() {}
function emitToMyself() {}

function onMessage(msg) {
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

function handleIO(socket, io) {
  // for react native
  socket.on("chat", () => onChat(msg, io));
  socket.on("message", onMessage);
  socket.on("typing", onTyping);
  socket.on("error", onError);
  socket.on("disconnect", onDisconnect);
}

export {
  initSocket,
  welcomeMessage,
  joinMessage,
  updateUserList,
  join,
  leave,
  onMessage,
  onTyping,
  onError,
  handleIO,
};
