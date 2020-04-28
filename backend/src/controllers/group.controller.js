import Group from "../models/group.model";
// get all groups
function list(req, res) {
  Group.find((err, groups) => {
    if (err) {
      return res.status(400).json({ error: "Error Fetching User" });
    }
    if (groups.length === 0) {
      return this.Success({ error: "No user in database." });
    }
    return res.json(groups);
  });
}

function getRecent(req, res) {
  Group.find()
    .limit(4)
    .sort({ name: 1 }) // replace with proper logic after
    .exec((err, groups) => {
      if (err) {
        return res.status(400).json({ error: "Error fetching popular groups" });
      }
      return res.json(groups);
    });
}

function getPopular(req, res) {
  Group.find()
    .limit(4)
    .sort({ name: -1 }) // replace with proper logic afterwards
    .exec((err, groups) => {
      if (err) {
        return res.status(400).json({ error: "Error fetching popular groups" });
      }
      return res.json(groups);
    });
}

export { list, getRecent, getPopular };
