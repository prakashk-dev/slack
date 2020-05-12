import User from "../models/user.model";
import { createCookie, createToken } from "../helpers";

async function loginOrRegisterUser(req, res) {
  if (!req.body.username || !req.body.password) {
    return res.status(401).json({
      error: "username or password missing",
    });
  }
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username }).exec();
    if (user) {
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // set cookie to the frontend
          let token = createToken(user);
          res.cookie(createCookie(token));
          return res.status(200).json({
            token,
          });
        } else {
          return res.status(401).json({
            error: "Authentication failed, password not match",
          });
        }
      });
      // if user not exists register
    } else {
      User({ username, password }).save((err, user) => {
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
