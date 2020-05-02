import User from "../models/user.model";
// get all users
function list(req, res) {
  User.find(null, "username", (err, users) => {
    if (err) {
      return res.status(400).json({
        type: "error",
        message: "Error Fetching User",
        res,
      });
    }
    if (users.length === 0) {
      return this.Success({ error: "No users found." });
    }
    return res.json(users);
  });
}

function findOne(req, res) {
  if (!req.params.username) {
    return res.json({ error: "Username is required" });
  }
  User.findOne(
    { username: req.params.username },
    "username gender ageGroup location",
    (err, user) => {
      if (err)
        return res.json({
          error: `User not found with username: ${req.params.username}`,
        });
      return res.json(user);
    }
  );
}

async function saveUser(req, res) {
  const { gender, ageGroup, username } = req.body;
  try {
    const user = await User.findOne({ username }).exec();
    if (user) {
      await await User.findOneAndUpdate(
        { username },
        { gender, ageGroup, username }
      );
      return res.json({ msg: "Successfully updated user information." });
    } else {
      await User.create({ gender, ageGroup, username });
      return res.json({ msg: "Successfully added new user." });
    }
  } catch (e) {
    return res.json({ error: e.message });
  }
}

function uniqueUsername(req, res) {
  const randomUsername = Math.random().toString(8).substr(2, 4);
  return res.send(`User${randomUsername}`);
}

export { list, uniqueUsername, findOne, saveUser };
