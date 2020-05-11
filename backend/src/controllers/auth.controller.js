import User from "../models/user.model";
import jwt from "jsonwebtoken";
import config from "../config";

//autheticate the user and if they are authenticated then provide the token
function setup(req, res) {
  //if no user name or password provided
  if (!req.body.username || !req.body.password) {
    return res.status(401).json({
      error: "username or pin missing",
    });
  }
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.status(401).json({
        error: "Authentication failed, user not found",
      });
    } else if (user) {
      //check if password match
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          user.password = undefined;
          const token = jwt.sign(user, config.jwt_secret, {
            expiresIn: 1440, //24 hours
          });
          return res.status(200).json({
            token: token,
          });
        } else {
          return res.status(401).json({
            error: "Authentication failed, password not match",
          });
        }
      });
    }
  });
}

export { setup };
