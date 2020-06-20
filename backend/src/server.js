if (
  process.env.NODE_ENV !== "development" &&
  process.env.NODE_ENV !== "staging"
) {
  require("source-map-support/register");
}

import connect from "./db";
import http from "http";
import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import config from "./config";
import routes from "./routes";
import socketio from "socket.io";
import socketIO from "./socket";

connect()
  .then(() => {
    const app = express(),
      server = http.createServer(app),
      io = socketio(server);

    // Middleware setup
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(cookieParser());
    app.use(cors());
    app.use("/api/static", express.static(path.join(__dirname, "../static")));

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
    socketIO(io);
  })
  .catch(console.log);
