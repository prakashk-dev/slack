
import {
  saveMessage,
  saveThreadMessage,
} from "../controllers/message.controller";
import { setSocket, getSocket, setIO, getIO } from "./data";

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

function onJoin(socket, { username, room, onReceiver, id }) {
  try {
    if (onReceiver !== "user") {
      const exists = Object.keys(socket.rooms).includes(room);
      if (!exists) {
        socket.join(room, () => {
          // update user list is done from the controller
          // updateUserList(socket, username, room);
          joinMessage(socket, username, room);
          welcomeMessage(socket);
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
}

async function onMessage(socket, msg) {
  try {
    const IO = getIO();
    const message = await saveMessage(msg);
    if (msg.onReceiver === "user") {          // send private message
      const socket = getSocket(msg.receiver);
      if(socket){                             // if user if offline, socket is undefined
        const socketId = socket.id;
        IO.to(socketId).emit("messages", message);
      }
    } else {                      // post message to rooms 
      socket.to(msg.receiver).emit("messages", message);
    }
  } catch (err) {
    console.log(err);
  }
}

async function onThreadMessage(socket, msg) {
  try {
    const message = await saveThreadMessage(msg);
    socket.to(msg.reply.receiver).emit("message", message);
  } catch (err) {
    console.log(err);
  }
}

function onTyping(socket, msg) {
  try {
    const { active, sender, onReceiver, receiver } = msg;
    const message = active ? `<b>${sender}</b> is typing ...` : null;
    socket.to(receiver).emit("typing", { ...msg, message });
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

// this function is called when user sign in
// or signin user refresh or visits the chat page
function joinUserToAllRoomsAndGroups(args) {
  const { socket, payload, callback } = args;
  const { roomsAndGroups, id } = payload;
  setSocket(id, socket);
  roomsAndGroups.forEach((id) => socket.join(id));
  if(callback) callback();
}

const handleConnection = (io, socket) => {
  // everytime new user joins update the global io as well
  setIO(io);

  socket.on("chat", (msg) => onChat(socket, msg));
  socket.on("typing", (msg) => onTyping(socket, msg));
  socket.on("message", (msg) => onMessage(socket, msg));
  socket.on("thread", (msg) => onThreadMessage(socket, msg));
  socket.on("join", (msg) => onJoin(socket, msg));
  socket.on("joinUserToAllRoomsAndGroups", (payload, callback) =>
    joinUserToAllRoomsAndGroups({socket, payload, callback})
  );
  // this event fires when user sign up
  socket.on("registerUsersSocket", (uuid, callback) => {
    setSocket(uuid, socket);
    callback()
  })
  socket.on("error", onError);
  socket.on("disconnect", onDisconnect);
};

module.exports = (io) =>
  io.on("connection", (socket) => handleConnection(io, socket));
