import config from "../config";
import jwt from "jsonwebtoken";
import chalk from "chalk";
import moment from "moment";

const createCookie = (cookieValue, cookieName = "token", exDays = 1) => {
  var d = new Date();
  d.setTime(d.getTime() + exDays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  return `${cookieName}=${cookieValue}; ${expires}; path=/`;
};

const createToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    socket: config.socket_url,
    env: config.env,
  };
  try {
    return jwt.sign(payload, config.jwt_secret, { expiresIn: "1d" });
  } catch (error) {
    console.log(error.message);
  }
};

const logger = (data) => {
  switch (typeof data) {
    case "string":
      console.log(chalk.inverse(data));
      break;
    case "object":
    case "string":
      const stringify = JSON.stringify(data, null, 4);
      console.log(chalk.inverse(stringify));
      break;
    default:
      console.log(data);
  }
};

function formatMessage(message) {
  const timeStamp = moment.utc().format();
  return {
    ...message,
    timeStamp,
  };
}
export { createCookie, createToken, logger, formatMessage };
