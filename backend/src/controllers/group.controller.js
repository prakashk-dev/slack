import Group from "../models/group.model";

// get all groups
function list(req, res) {
  Group.find((err, groups) => {
    if (err) {
      return res.status(400).json({ error: "Error Fetching Groups" });
    }
    if (groups.length === 0) {
      return res.json({ error: "No group in database." });
    }
    return res.json(groups);
  });
}
// get names only
function groupName(req, res) {
  Group.find(null, "name", (err, names) => {
    if (err) {
      return res.status(400).json({ error: "Error Fetching grops name" });
    }
    if (names.length === 0) {
      return res.json({ error: "No group in database." });
    }
    return res.json(names);
  });
}
// recent group
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

async function findById(req, res) {
  if (!req.params.id) {
    return res.json({ error: "Group id is required" });
  }
  if (req.params.id === "welcome") {
    return res.json({ name: "Bhet Ghat", users: [] });
  }

  try {
    const group = await Group.findOne({ _id: req.params.id })
      .populate("users", "username")
      .populate("messages.from", "username")
      .populate("messages.to", "name")
      .exec();
    return res.json(group);
  } catch (e) {
    console.log(e.message);
    return res.json({
      error: `Group not found with id: ${req.params.id}`,
    });
  }
}

async function getUsers(req, res) {
  if (!req.params.id) {
    return res.json({ error: "id required" });
  }
  try {
    const users = await Group.findOne({ _id: req.params.id })
      .populate("users", "username")
      .exec();
    if (users.length === 0) {
      return res.json({ error: "No users." });
    }
    return res.json(users);
  } catch (error) {
    return res.json({ error: "error fetching users" });
  }
}
async function joinRoom(req, res) {
  const { user_id } = req.query;
  const { id: groupId } = req.params;
  if (groupId === "welcome") {
    return res.json({ name: "Bhet Ghat", users: [] });
  }
  if (!groupId || !user_id) {
    return res.json({ error: "groupId or user_id missing." });
  }
  try {
    await Group.findOneAndUpdate(
      { _id: groupId },
      { $addToSet: { users: [user_id] } }
    ).exec();
    const group = await Group.findOne({ _id: groupId })
      .populate("users", "username")
      .populate("messages.from", "username")
      .populate("messages.to", "name")
      .exec();
    return res.json(group);
  } catch (error) {
    console.log(error);
    return res.json({ error: error.message });
  }
}

export { list, getRecent, findById, groupName, getUsers, joinRoom };
