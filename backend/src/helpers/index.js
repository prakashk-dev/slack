import config from "../config";
import jwt from "jsonwebtoken";

export const createCookie = (cookieValue, cookieName = "token", exDays = 1) => {
  var d = new Date();
  d.setTime(d.getTime() + exDays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  return `${cookieName}=${cookieValue}; ${expires}; path=/`;
};

export const createToken = (user) => {
  const payload = {
    sub: user._id,
    username: user.username,
    socket: config.socket_url,
  };
  try {
    return jwt.sign(payload, config.jwt_secret, { expiresIn: "1d" });
  } catch (error) {
    console.log(error.message);
  }
};
