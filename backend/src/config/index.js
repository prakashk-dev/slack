const {
  NODE_ENV,
  MONGO_HOST,
  MONGO_PORT,
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_DB,
  JWT_SECRET,
  SOCKET_URL,
} = process.env;

const config = {
  env: NODE_ENV,
  mongo: {
    url: `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`,
    user: MONGO_USERNAME,
    pass: MONGO_PASSWORD,
  },
  jwt_secret: JWT_SECRET,
  socket_url: SOCKET_URL,
};

export default config;
