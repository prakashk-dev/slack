import User from "../models/user.model";
import { createCookie, createToken, logger } from "../helpers";
import { sendOnlineStatus } from "../controllers/user.controller";

async function loginOrRegisterUser(req, res) {
  if (!req.body.email || !req.body.password) {
    return res.status(422).json({
      error: "email or password missing",
    });
  }
  const email = new RegExp("^" + req.body.email + "$", "i");
  try {
    // use findOne only in this case, as we are using post hook to join the socket
    let user = await User.findOne({ email: { $regex: email } })
      .select("+password")
      .populate("friends.friend")
      .populate("rooms.room")
      .populate("groups.group")
      .exec();

    if (user) {
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          user.status = "online";
          user.save((err) => {
            if (err) {
              return res.json({
                error: "Something went wrong while authenticating you.",
              });
            }
            // if user has friends, send socket info as online
            sendOnlineStatus(user);
            // don't send these fields to client
            user = user.toJSON();
            delete user.password;
            // set cookie to the frontend
            let token = createToken(user);
            res.cookie(createCookie(token));

            return res.status(200).json({
              user,
              token,
            });
          });
        } else {
          return res.json({
            error: "Authentication failed, password not match",
          });
        }
      });
      // if user not exists register
    } else {
      const { email, password } = req.body;
      let user = await User.create({ email, password, status: "online" });
      // set cookie to the frontend
      // also include email and hashed password so that when we decode the token
      // we can verify that the email and password match to our database
      let token = createToken(user);
      res.cookie(createCookie(token));
      user = user.toJSON();
      delete user.password;

      return res.status(200).json({
        user,
        token,
      });
    }
  } catch (err) {
    logger(err);
    return res.json({ error: err.message });
  }
}

const login = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(422).json({
      error: "email or password missing",
    });
  }
  const email = new RegExp("^" + req.body.email + "$", "i");

  try {
    // use findOne only in this case, as we are using post hook to join the socket
    let user = await User.findOne({ email: { $regex: email } })
      .select("+password")
      .populate("friends.friend")
      .populate("rooms.room")
      .populate("groups.group")
      .exec();

    if (user) {
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          user.status = "online";
          user.save((err) => {
            if (err) {
              return res.json({
                error: "Something went wrong while authenticating you.",
              });
            }
            // if user has friends, send socket info as online
            sendOnlineStatus(user);
            // don't send these fields to client
            user = user.toJSON();
            delete user.password;
            // set cookie to the frontend
            let token = createToken(user);
            res.cookie(createCookie(token));

            return res.status(200).json({
              user,
              token,
            });
          });
        } else {
          return res.json({
            error: "Authentication failed, password not match",
          });
        }
      });
      // if user not exists register
    } else {
      return res.json({
        error: `User not found with email ${req.body.email}`,
      });
    }
  } catch (err) {
    logger(err);
    return res.json({ error: err.message });
  }
};

const signup = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(422).json({
      error: "email or password missing",
    });
  }
  const email = new RegExp("^" + req.body.email + "$", "i");
  try {
    let user = await User.findOne({ email: { $regex: email } }).exec();
    if (user) {
      return res.json({
        error: `User already exists with email: ${req.body.email}`,
      });
    } else {
      const { email, password } = req.body;
      let user = await User.create({
        email,
        password,
        status: "online",
        full_name: req.body.full_name,
      });
      // set cookie to the frontend
      // also include email and hashed password so that when we decode the token
      // we can verify that the email and password match to our database
      let token = createToken(user);
      res.cookie(createCookie(token));
      user = user.toJSON();
      delete user.password;

      return res.status(200).json({
        user,
        token,
      });
    }
  } catch (err) {
    logger(err);
    return res.json({ error: err.message });
  }
};

export { loginOrRegisterUser, login, signup };

/**
 * See what information should be Included in the json web token
 * What information should be return back to the frontend
 */
