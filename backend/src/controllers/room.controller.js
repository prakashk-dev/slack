import Room from "../models/room.model";
import { UserModel } from "../models";
import { logger } from "../helpers";
import mongoose from "mongoose";

// get all rooms
const getAll = async (req, res) => {
  try {
    const rooms = await Room.find({})
      .populate("members")
      .populate("conversations")
      .exec();
    return res.json(rooms);
  } catch (err) {
    logger(err);
    return res
      .status(400)
      .json({ error: `Error Fetching Rooms: ${err.message}` });
  }
};
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

// /:id
async function getOne(req, res) {
  const id = res.locals.id || req.params.id;
  if (id === "welcome") {
    // send video url or something
    return res.json({ name: "Bhet Ghat", users: [] });
  } else if (!id) {
    return res.json({ error: "Room id is missing." });
  } else {
    try {
      const room = await Room.findById(id)
        .populate("users")
        .populate("messages")
        .exec();
      if (room) {
        // don't know why schema level virtual is not working
        return res.json(room.toJSON({ virtuals: true }));
      } else {
        return res.json({ error: `Room not found with id ${id}` });
      }
    } catch (error) {
      console.log(error);
      return res.json({ error: error.message });
    }
  }
}

export { getAll, getRecent, findById, groupName, getUsers, getOne };
