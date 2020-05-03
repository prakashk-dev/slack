import User from "../models/user.model";
// get all users
function list(req, res) {
  User.find(null, "username messages friends gender ageGroup", (err, users) => {
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

async function findOne(req, res) {
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

async function saveUser(req, res) {
  const { gender, ageGroup, username } = req.body;
  try {
    // try to find and update record, if not found create a new one (upsert does this )
    await User.findOneAndUpdate(
      { username },
      { gender, ageGroup, username },
      { upsert: true }
    ).exec();
    return res.json({ msg: "Successfully added/updated user information." });
  } catch (e) {
    return res.json({ error: e.message });
  }
}

function uniqueUsername(req, res) {
  const randomUsername = Math.random().toString(8).substr(2, 4);
  return res.send(`User${randomUsername}`);
}

export { list, uniqueUsername, findOne, saveUser };
