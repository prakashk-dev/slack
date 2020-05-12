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
      return res.json({ error: "No users found." });
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

export { list, findOne };
