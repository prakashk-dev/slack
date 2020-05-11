import Group from "../models/group.model";

// get all groups
function list(req, res) {
  if (!req.user) {
    return res
      .status(401)
      .json({ error: "You don't have an access to this information." });
  }
  Group.find((err, groups) => {
    if (err) {
      return res.status(400).json({ error: "Error Fetching Groups" });
    }
    if (groups.length === 0) {
      return res.json({ error: "No user in database." });
    }
    return res.json(groups);
  });
}

function groupName(req, res) {
  if (!req.user) {
    return res
      .status(401)
      .json({ error: "You don't have an access to this information." });
  }
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

function getRecent(req, res) {
  if (!req.user) {
    return res
      .status(401)
      .json({ error: "You don't have an access to this information." });
  }
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
  if (!req.user) {
    return res
      .status(401)
      .json({ error: "You don't have an access to this information." });
  }
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

async function findById(req, res) {
  if (!req.user) {
    return res
      .status(401)
      .json({ error: "You don't have an access to this information." });
  }
  if (!req.params.id) {
    return res.json({ error: "Group id is required" });
  }
  if (req.params.id === "welcome") {
    return res.json({ name: "Bhet Ghat", users: [] });
  }
  try {
    const group = await Group.findById({ _id: req.params.id })
      .populate("users", "username")
      .exec();
    return res.json(group);
  } catch (e) {
    console.log(e.message);
    return res.json({
      error: `Group not found with id: ${req.params.id}`,
    });
  }
}

export { list, getRecent, getPopular, findById, groupName };
