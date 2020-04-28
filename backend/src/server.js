import express from "express";
import path from "path";
import http from "http";
import bodyParser from "body-parser";
import logger from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import config from "./config";
import { UserModel, GroupModel } from "./models";
import { users, cities } from "./test-data/data";
import routes from "./routes";
import io from "socket.io";

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

app.use("/api/static", express.static(path.join(__dirname, "../static")));

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

const webSocket = io(server);

webSocket.on("connect", (socket) => {
  socket.on("join", (user) => {
    console.log(`${user.username} has joined the room.`);
    socket.join(user.group);
    socket.emit("message", {
      user: "admin",
      text: `${user.username}, welcome to room ${user.group}.`,
    });
    socket.broadcast
      .to(user.group)
      .emit("message", { user: "admin", text: `${user.username} has joined!` });
    // also send all the user in that group
  });

  socket.on("sendMessage", (data) => {
    socket.broadcast.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("User has disconnected");
  });
});
