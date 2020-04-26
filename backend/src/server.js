import express from "express";
import http from "http";
import bodyParser from "body-parser";
import logger from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import config from "./config";
import { UserModel, GroupModel } from "./models";
import { users, cities } from "./test-data/data";
import routes from "./routes";
import WebSocket from "ws";

const app = express();
const server = http.createServer(app);

const mongoUri = config.mongo.host;
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    server: { socketOptions: { keepAlive: 1 } },
  })
  .catch((err) => console.log(err.message));

// import dummy data
async function seedData() {
  const data = await UserModel.find({ username: "user1" }).exec();
  if (data.length) {
    return;
  }
  try {
    users.forEach((user) => {
      const userModel = new UserModel(user);
      userModel.save(user);
    });
    cities.forEach((city) => {
      const groupModel = new GroupModel(city);
      groupModel.save(cities);
    });
  } catch (err) {
    console.error("Error inserting data into the database", err.message);
  }
}
seedData();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

if (config.env === "development") {
  app.use(logger("dev"));
}

app.use("/api", routes);

const port = process.env.PORT || "8080";

server.listen(port, () => {
  console.log(
    `Application is running on Env: ${process.env.NODE_ENV} in port ${port}`
  );
});

const wss = new WebSocket.Server({ server });
wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    console.log("Message from client", data);
  });

  ws.send("Message from server");
});
