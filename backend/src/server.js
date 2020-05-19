if (process.env.NODE_ENV !== "production") {
  require("source-map-support/register");
}

import connect from "./db";
import http from "http";
import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import config from "./config";
import { handleIO } from "./socket";
import routes from "./routes";
import socketio from "socket.io";

connect()
  .then(() => {
    const app = express();
    const server = http.createServer(app);

    // Middleware setup
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(cookieParser());
    app.use(cors());

    if (config.env === "development") {
      app.use(logger("dev"));
    }

    app.use("/api", routes);

    const port = process.env.PORT || "8080";
    server.listen(port, () =>
      console.log(
        `Application is running on Env: ${process.env.NODE_ENV} in port ${port}`
      )
    );

    const io = socketio(server);
    io.on("connection", (socket) => handleIO(socket, io));
  })
  .catch(console.log);
