import moment from "moment";
/**
{
  name: String,
  users: [{ type: Schema.Types.ObjectId, ref: "user" }],
  description: String,
  image: String,
  messages: [
    {
      user: { type: Schema.Types.ObjectId, ref: "user" },
      group: { type: Schema.Types.ObjectId, ref: "group" },
      timeStamp: Date,
    },
  ],
  timeStamp: Date,
}
**/
const rooms = [];

// Join user to room
function roomJoin(user) {
  // first check if a user is joining the room that  is already exists in the socket
  let index = -1;
  let room = rooms.filter((room, i) => {
    if (room.name === user.room) {
      index = i;
      return true;
    }
  });
  if (room.length) {
    rooms[index] = {
      ...room[0],
      users: [user.username, ...room[0].users],
      timeStamp: moment().format("h:mm:a"),
    };
  } else {
    const { room: name, username } = user;
    room = {
      id: user.id,
      name,
      users: [username],
      description: `This is a room about something ${name}`,
      messages: [
        {
          username,
          message: `Welcome to the room ${name}`,
          timeStamp: moment().format("h:mm a"),
        },
      ],
      timeStamp: moment().format("h:mm a"),
    };
    rooms.push(room);
  }

  return user;
}

// // Get current user
function getCurrentRoom(name) {
  return rooms.find((room) => room.name === name);
}

// // User leaves chat
// function userLeave(id) {
//   const index = users.findIndex((user) => user.id === id);

//   if (index !== -1) {
//     return users.splice(index, 1)[0];
//   }
// }

// Get room users
function getRoomUsers(room) {
  const r = rooms.find((rm) => rm.name === room);
  return r ? r["users"] : null;
}

function userAlreadyJoined({ username, room }) {
  return getRoomUsers(room) && getRoomUsers(room).includes(username);
}

module.exports = {
  roomJoin,
  getCurrentRoom,
  // userLeave,
  getRoomUsers,
  userAlreadyJoined,
};
