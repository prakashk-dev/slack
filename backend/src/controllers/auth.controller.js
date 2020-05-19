import User from "../models/user.model";
import { createCookie, createToken } from "../helpers";

async function loginOrRegisterUser(req, res) {
  if (!req.body.username || !req.body.pin) {
    return res.status(422).json({
      error: "username or pin missing",
    });
  }
  const username = new RegExp("^" + req.body.username + "$", "i");
  // change it to string so that pin can be hashed using salt

  try {
    // use findOne only in this case, as we are using post hook to join the socket
    const user = await User.findOne({ username: { $regex: username } })
      .select("-pin")
      .exec();
    if (user) {
      user.comparePassword(req.body.pin, function (err, isMatch) {
        if (isMatch && !err) {
          // set cookie to the frontend
          let token = createToken(user);
          res.cookie(createCookie(token));
          return res.status(200).json({
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
      User.create({ username, pin }, (err, user) => {
        if (err) throw err;
        // set cookie to the frontend
        // also include username and hashed password so that when we decode the token
        // we can verify that the username and password match to our database
        const token = createToken(user);
        res.cookie(createCookie(token));
        return res.status(200).json({
          token,
        });
      });
    }
  } catch (e) {
    return res.json({ error: e.message });
  }
}

export { loginOrRegisterUser };

/**
 * See what information should be Included in the json web token
 * What information should be return back to the frontend
 */
