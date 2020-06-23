import mongoose from "mongoose";
import config from "../config";

const options = {
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
  connectTimeoutMS: 10000,
  useCreateIndex: true,
  useFindAndModify: false,
  user: config.mongo.user,
  pass: config.mongo.pass,
  server: { socketOptions: { keepAlive: 1 } },
};

const connect = async () =>
  mongoose
    .connect(config.mongo.url, options)
    .catch((err) => console.log(err.message));

export default connect;
