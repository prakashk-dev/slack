import User from "../models/user.model";
import jwt from "jsonwebtoken";
import config from "../config";

// get all users
function list(req, res) {
  if (!req.user) {
    return res
      .status(401)
      .json({ error: "You don't have an access to this information." });
  }
  User.find(null, "username messages friends gender ageGroup", (err, users) => {
    if (err) {
      return res.status(400).json({
        type: "error",
        message: "Error Fetching User",
        res,
      });
    }
    if (users.length === 0) {
      return res.json({ error: "No users found." });
    }
    return res.json(users);
  });
}

async function findOne(req, res) {
  if (!req.user) {
    return res
      .status(401)
      .json({ error: "You don't have an access to this information." });
  }
  if (!req.params.username) {
    return res.json({ error: "Username is required" });
  }
  try {
    const user = await User.findOne(
      { username: req.params.username },
      "username gender ageGroup location friends"
    )
      .populate("friends", "username")
      .exec();
    return res.json(user);
  } catch (error) {
    return res.json({
      error: `User not found with username: ${req.params.username}`,
    });
  }
}

async function loginOrRegisterUser(req, res) {
  if (!req.body.username || !req.body.password) {
    return res.status(401).json({
      error: "username or password missing",
    });
  }
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username }).exec();
    // check pin if user exists
    if (user) {
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
      // if user not exists register
    } else {
      User({ username, password }).save((err) => {
        if (err) throw err;
        user.password = undefined;
        const token = jwt.sign(user, config.jwt_secret, {
          expiresIn: 1440, //24 hours
        });
        return res.status(200).json({
          token: token,
        });
      });
    }
  } catch (e) {
    return res.json({ error: e.message });
  }
}

export { list, findOne, loginOrRegisterUser };
