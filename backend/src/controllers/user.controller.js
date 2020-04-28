import User from "../models/user.model";
// get all users
function list(req, res) {
  User.find((err, users) => {
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

function uniqueUsername(req, res) {
  const randomUsername = Math.random().toString(8).substr(2, 4);
  return res.send(`User${randomUsername}`);
}

export { list, uniqueUsername };
