import { logger, formatMessage } from "../helpers";
import { saveMessage } from "../controllers/message.controller";
import { setSocket, getSocket, setIO } from "./data";

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
  // console.log("*********************************************");
  // console.log("Join event comming from client", { username, room });
  // console.log("*********************************************");
  try {
    setSocket(id, socket);
    // join to room and group if it is not individual chat message
    console.log("All the rooms of this socket", Object.keys(socket.rooms));
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

async function onMessage(io, socket, msg) {
  console.log("message comming from client", msg);
  try {
    const message = await saveMessage(msg);
    console.log("message", message);
    if (msg.onReceiver === "user") {
      // console.log("I am sender", msg.sender);
      // console.log("I am receiver", msg.receiver);
      // console.log("These are private channels", privateChannels);
      // console.log(
      //   "I am sending to this socketID",
      //   privateChannels[msg.receiver]
      // );
      const socketId = getSocket(msg.receiver).id;
      io.to(socketId).emit("messages", message);
    } else {
      socket.to(msg.receiver).emit("messages", message);
    }
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

function joinUserToAllRoomsAndGroups(socket, roomsAndGroups) {
  roomsAndGroups.forEach((rg) => {
    socket.join(rg);
  });
}

const handleConnection = (io, socket) => {
  // everytime new user joins update the global io as well
  setIO(io);

  socket.on("chat", (msg) => onChat(socket, msg));
  socket.on("typing", (msg) => onTyping(socket, msg));
  socket.on("message", (msg) => onMessage(io, socket, msg));
  socket.on("join", (msg) => onJoin(socket, msg));
  socket.on("joinUserToAllRoomsAndGroups", (msg) =>
    joinUserToAllRoomsAndGroups(socket, msg)
  );
  socket.on("error", onError);
  socket.on("disconnect", onDisconnect);
};

module.exports = (io) =>
  io.on("connection", (socket) => handleConnection(io, socket));
