import moment from "moment";
import { getSocket, getIO, } from "./data";

// helper function
function getLastActiveUrl(user) {
    const { rooms, groups, friends } = user;
    if(rooms.length || groups.length || friends.length) {
      let compareArrays = [rooms[0], groups[0], friends[0]];
      compareArrays = compareArrays.filter((arr) => {
        if (arr === undefined) {
          return false;
        } else {
          return arr.friend
            ? arr.status !== "pending" || arr.status !== "rejected"
            : true;
        }
      });
    
      let lastActive = compareArrays.reduce(
        (lastActive, current) =>
          moment(lastActive.last_active).isAfter(current.last_active)
            ? lastActive
            : current,
        compareArrays[0]
      );
    
      const { friend, room, group } = lastActive;
      const sub = friend ? "u" : room ? "r" : "g";
      const id =
        (friend && friend.username) || (room && room.id) || (group && group.id);
      return { sub, id };
    }
    return { sub: "r", id: "welcome" };
  };
  
  // helper function used by other controller
  function emitOnlineStatus (user) {
    try {
      if (user.friends.length) {
        user.friends.forEach(({ friend }) => {
          const friendId = friend._id || friend.id;
          const friendSocket = getSocket(friendId);
          if (friendSocket) {
            const userId = user._id || user.id;
            getIO()
              .to(friendSocket.id)
              .emit("userOnline", { id: userId, status: user.status });
          }
        });
      }
    } catch (err) {
      console.log("Error updateRoomUsers", err);
    }
  };

  function emitMessage(msg) {
    if (msg.onReceiver === "user") {
        const socket = getSocket(msg.receiver.id);
        if(socket) {
          const socketId = socket.id;
          const IO = getIO();
          IO.to(socketId).emit("messages", msg);
        } else {
            // send not delivered status
          console.log("User is offline", msg.receiver.username);
        }
      } else {
        const socket = getSocket(msg.sender.id);
        if(socket){
          socket.to(msg.receiver.id).emit("messages", msg);
        } else {
          console.log("Socket not found for user", msg.sender.username)
        }
      }
  }

//   for now thread is only enable for rooms
  function emitThreadMessage(msg) {
    const { sender, message } = msg;
    const socket = getSocket(sender);
    socket.to(message.receiver.id).emit("message", message);
  }

  export { getLastActiveUrl, emitOnlineStatus, emitMessage, emitThreadMessage };