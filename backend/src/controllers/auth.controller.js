import User from "../models/user.model";
import { createCookie, createToken, logger } from "../helpers";

async function loginOrRegisterUser(req, res) {
  if (!req.body.username || !req.body.pin) {
    return res.status(422).json({
      error: "username or pin missing",
    });
  }
  const username = new RegExp("^" + req.body.username + "$", "i");
  try {
    // use findOne only in this case, as we are using post hook to join the socket
    let user = await User.findOne({ username: { $regex: username } })
      .select("+pin")
      .populate("friends.friend")
      .populate("rooms.room")
      .populate("groups.group")
      .exec();

    if (user) {
      user.comparePassword(req.body.pin, function (err, isMatch) {
        if (isMatch && !err) {
          // don't send these fields to client
          user = user.toJSON();
          delete user.pin;
          // set cookie to the frontend
          let token = createToken(user);
          res.cookie(createCookie(token));

          return res.status(200).json({
            user,
            token,
          });
        } else {
          return res.json({
            error: "Authentication failed, password not match",
          });
        }
      });
      // if user not exists register
    } else {
      const { username, pin } = req.body;
      let user = await User.create({ username, pin });
      // set cookie to the frontend
      // also include username and hashed password so that when we decode the token
      // we can verify that the username and password match to our database
      let token = createToken(user);
      res.cookie(createCookie(token));
      user = user.toJSON();
      delete user.pin;

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

export { loginOrRegisterUser };

/**
 * See what information should be Included in the json web token
 * What information should be return back to the frontend
 */
