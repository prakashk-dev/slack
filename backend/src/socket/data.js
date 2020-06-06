// we can store this to a file as well
let data = {
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

const setSocket = (id, socket) => {
  data.sockets[id] = socket;
};

const isOnline = (id) => {
  return data.sockets[id] != undefined;
};

export { getIO, setIO, getSocket, setSocket, isOnline };
