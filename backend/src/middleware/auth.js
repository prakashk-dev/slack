import express from "express";
import config from "../config";
import jwt from "jsonwebtoken";

const router = express.Router();

//adding middleware for unauthorised access
router.use((req, res, next) => {
  //checking token from cookie or header
  const token = req.cookies.token || req.headers.token;
  if (token) {
    //verify secret and check access level
    jwt.verify(token, config.jwt_secret, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          error: "failed to authenticate token",
        });
      } else {
        // const { username, password } = decoded;
        // check if that username and password is valid
        //check access level - token is authenticated but might not be authorized
        req.decoded = decoded;
        next();
      }
    });
  } else {
    //if no header send to the end points and this will handle the error
    return res.status(401).json({
      error: "You are not authorized",
    });
  }
});

export default router;
