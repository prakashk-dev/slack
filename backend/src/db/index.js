import mongoose from "mongoose";
import config from "../config";

const connect = async () =>
  mongoose
    .connect(config.mongo.host, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      server: { socketOptions: { keepAlive: 1 } },
    })
    .catch((err) => console.log(err.message));

export default connect;
