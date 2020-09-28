// we can store this to a file as well
const data = {
  io: {}, // global io variable
  sockets: {}, //{ user_id: socket }
};

const getIO = () => {
  return data.io;
};

const setIO = (io) => {
  data.io = io;
};

const getSocket = (id) => {
  return data.sockets[id];
};

const setSocket = (user, socket) => {
  socket.uuid = user.id;
  data.sockets[user.id] = socket;
};

const removeSocket = (socket) => {
  delete data.sockets[socket.uuid];
}

const isOnline = (id) => {
  return data.sockets[id] != undefined;
};


export { getIO, setIO, getSocket, setSocket, isOnline, removeSocket };
