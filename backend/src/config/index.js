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
  mongoUrl: `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`,
  jwt_secret: JWT_SECRET,
  socket_url: SOCKET_URL,
};

export default config;
