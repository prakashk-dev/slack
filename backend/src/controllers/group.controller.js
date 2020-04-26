import Group from "../models/group.model";
// get all groups
function list(req, res) {
  Group.find((err, groups) => {
    if (err) {
      return res.status(400).json({
        type: "error",
        message: "Error Fetching User",
        res,
      });
    }
    if (groups.length === 0) {
      return this.Success({
        data: null,
        message: "no user in database",
        res,
      });
    }
    return res.json({
      data: groups,
      message: "list of groups",
    });
  });
}

export { list };
