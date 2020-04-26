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
      return this.Success({
        data: null,
        message: "no user in database",
        res,
      });
    }
    return res.json({
      data: users,
      message: "list of users",
    });
  });
}

export { list };
