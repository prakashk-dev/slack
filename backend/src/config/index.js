const config = {
  env: process.env.NODE_ENV || "production",
  mongo: {
    host: process.env.MONGO_HOST || "mongodb://mongo:27017/bhetghat",
    port: process.env.MONGO_PORT || "27017",
  },
  jwt_secret: process.env.JWT_SECRET || "supersecret",
  socket_url: ["production", "staging"].includes(process.env.NODE_ENV)
    ? "https://socket.bhet-ghat.com"
    : "http://localhost:3001",
};

export default config;
