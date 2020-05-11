import express from "express";
import config from "../config";
import jwt from "jsonwebtoken";

const router = express.Router();

//adding middleware for unauthorised access
router.use((req, res, next) => {
  //checking token from header
  const token = req.headers["token"];
  if (token) {
    //verify secret and check access level
    jwt.verify(token, config.jwt_secret, (err, user) => {
      if (err) {
        return res.status(401).json({
          error: "failed to authenticate token",
        });
      } else {
        //check access level
        req.user = user;
        next();
      }
    });
  } else {
    //if no header send to the end points and this will handle the error
    req.user = undefined;
    next();
  }
});

export default router;
