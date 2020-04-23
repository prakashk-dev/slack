const config = {
  env: process.env.NODE_ENV || "production",
  mongo: {
    host: process.env.MONGO_HOST || "mongodb://mongo/bhetghat",
    port: process.env.MONGO_PORT || "3003",
  },
};

export default config;
