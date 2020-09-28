import {
  saveMessage,
  saveThreadMessage,
} from "../controllers/message.controller";

import { _updateOneById } from "../controllers/user.controller";
import { getLastActiveUrl, emitOnlineStatus } from './helpers';
import { setSocket, getSocket, setIO, getIO, removeSocket } from "./data";

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
    if(onReceiver === "user"){
      const socket = getSocket(receiver);
      if(socket){
        const IO = getIO();
        const socketId = socket.id;
        const message = active ? `<b>${sender}</b> is typing ...` : null;
        IO.to(socketId).emit("typing", { ...msg, message });
      }
    } else {
      const message = active ? `<b>${sender}</b> is typing ...` : null;
      socket.to(receiver).emit("typing", { ...msg, message });
    }
  } catch (err) {
    console.log(err);
  }
}

async function onDisconnect(reason, socket) {
  removeSocket(socket);
  const user = await _updateOneById(socket.uuid, { status: "offline" });
  if(user && !user.error) {
    emitOnlineStatus(user);
  }
  console.log("Disconnected:", reason);
}


function onUserLogout(uuid) {
  removeSocket({ uuid });
}

function onError(error) {
  console.log("Erron on socket:", error);
}

function onChat(socket, msg) {
  socket.emit("chat", msg);
}

function handleUserRegistration(socket, user, callback){
  setSocket(user, socket);
  const { rooms, groups } = user;
  if(rooms.length || groups.length) {
    const roomsAndGroups = [
      ...rooms.map(({ room }) => room.id),
      ...groups.map(({ group }) => group.id),
    ];
    roomsAndGroups.forEach(id => socket.join(id));
  }
  callback && callback(getLastActiveUrl(user))
}

const handleConnection = (io, socket) => {
  // everytime new user joins update the global io as well
  setIO(io);
  console.log("connected")
  socket.on("chat", (msg) => onChat(socket, msg));
  socket.on("typing", (msg) => onTyping(socket, msg));
  socket.on("message", (msg) => onMessage(socket, msg));
  socket.on("thread", (msg) => onThreadMessage(socket, msg));
  socket.on("join", (msg) => onJoin(socket, msg));
  socket.on("registerUserForSocket", (user, callback) => handleUserRegistration(socket, user, callback))
  socket.on("error", onError);
  socket.on("disconnect", (reason) => onDisconnect(reason, socket));
  socket.on("logout", (uuid) => onUserLogout(uuid));
};

module.exports = (io) =>
  io.on("connection", (socket) => handleConnection(io, socket));
