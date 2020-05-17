import Room from "../models/room.model";

// get all rooms
function list(req, res) {
  Room.find((err, rooms) => {
    if (err) {
      return res.status(400).json({ error: "Error Fetching Rooms" });
    }
    if (rooms.length === 0) {
      return res.json({ error: "No group in database." });
    }
    return res.json(rooms);
  });
}
// get names only
function groupName(req, res) {
  Room.find(null, "name", (err, names) => {
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
  Room.find()
    .limit(4)
    .sort({ name: 1 }) // replace with proper logic after
    .exec((err, rooms) => {
      if (err) {
        return res.status(400).json({ error: "Error fetching popular rooms" });
      }
      return res.json(rooms);
    });
}

async function findById(req, res) {
  if (!req.params.id) {
    return res.json({ error: "Room id is required" });
  }
  if (req.params.id === "welcome") {
    return res.json({ name: "Bhet Ghat", users: [] });
  }

  try {
    const group = await Room.findOne({ _id: req.params.id })
      .populate("users", "username")
      .populate("messages.from", "username")
      .populate("messages.to", "name")
      .exec();
    return res.json(group);
  } catch (e) {
    console.log(e.message);
    return res.json({
      error: `Room not found with id: ${req.params.id}`,
    });
  }
}

async function getUsers(req, res) {
  if (!req.params.id) {
    return res.json({ error: "id required" });
  }
  try {
    const users = await Room.findOne({ _id: req.params.id })
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
    await Room.findOneAndUpdate(
      { _id: groupId },
      { $addToSet: { users: [user_id] } }
    ).exec();
    const group = await Room.findOne({ _id: groupId })
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
