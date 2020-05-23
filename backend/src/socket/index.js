import { logger, formatMessage } from "../helpers";
import { saveMessage } from "../controllers/message.controller";

function welcomeMessage(socket) {
  try {
    socket.emit("welcome", "Welcome to the room");
  } catch (err) {
    console.log(err);
  }
}

function joinMessage(socket, username, room) {
  try {
    socket.to(room).emit("newUserjoined", `${username} has joined the chat.`);
  } catch (err) {
    console.log(err);
  }
}

function updateUserList(socket, username, room) {
  try {
    socket.to(room).emit("updateUser", username);
  } catch (err) {
    console.log(err);
  }
}

function onJoin(socket, { username, room }) {
  console.log("*********************************************");

  console.log("Join event comming from client", { username, room });
  console.log("Rooms", Object.keys(socket.rooms));

  console.log("*********************************************");
  if (room) {
    try {
      const exists = Object.keys(socket.rooms).includes(room);
      if (!exists) {
        socket.join(room, () => {
          updateUserList(socket, username, room);
          joinMessage(socket, username, room);
          welcomeMessage(socket);
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
}

async function onMessage(socket, msg) {
  try {
    const message = await saveMessage(msg);
    socket.to(msg.receiver).emit("messages", message);
    // save this message to the database
  } catch (err) {
    console.log(err);
  }
}

function onTyping(socket, msg) {
  try {
    const { active, sender } = msg;
    const message = active ? `<b>${sender}</b> is typing ...` : null;
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

const handleConnection = (io, socket) => {
  socket.on("chat", (msg) => onChat(socket, msg));
  socket.on("typing", (msg) => onTyping(socket, msg));
  socket.on("message", (msg) => onMessage(socket, msg));
  socket.on("join", (msg) => onJoin(socket, msg));
  socket.on("error", onError);
  socket.on("disconnect", onDisconnect);
};

module.exports = (io) =>
  io.on("connection", (socket) => handleConnection(io, socket));
