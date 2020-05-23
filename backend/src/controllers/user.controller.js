import mongoose from "mongoose";
import moment from "moment";
import { User, Room } from "../models";
import { getOne } from "./room.controller";
import { logger } from "../helpers";

// get all users
const getAll = async (req, res) => {
  try {
    const users = await User.find().populate("rooms.room").exec();
    return res.json(users);
  } catch (err) {
    return res.status(400).json({ error: "Error Fetching User" });
  }
};

async function findOne(req, res) {
  const { id } = req.params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.json({
      error: "Either user id is missing or is not a valid user id.",
    });
  }
  try {
    const user = await User.findById(id).populate("friends.friend").exec();
    if (user) {
      return res.json(user);
    }
    return res.json({
      error: `User not found with username: ${id}`,
    });
  } catch (err) {
    return res.status(400).json({
      error: `Error fetching user for id: ${id}`,
    });
  }
}
// /:id/rooms/:roomId
const findRoomById = async (req, res) => {
  const { roomId, id } = req.params;
  if (!roomId || !id) {
    return res.json({ error: "Group id and user id needed" });
  } else if (roomId === "welcome") {
    return res.json({ name: "Bhetghat" });
  } else {
    try {
      const room = await Room.findById(roomId).exec();
      // only push if the room is not exists
      await User.updateOne(
        { _id: id, "rooms.name": { $ne: room.name } },
        {
          $push: {
            rooms: {
              name: room.name,
              last_active: moment.utc().format(),
            },
          },
        },
        { new: true }
      ).exec();

      const usr = await User.findById(id)
        .populate("rooms.room")
        .populate("groups.group")
        .populate("friends.friend")
        .exec();
      res.locals = {
        id: roomId,
        user: usr,
      };
      getOne(req, res);
    } catch (err) {
      logger(err);
      return res.json({ error: err.message });
    }
  }
};

const findGroupById = async (req, res) => {};

const updateRoomUser = async (user) => {};

const deleteOne = async (req, res) => {
  try {
    const id = req.params.id;
    await User.findByIdAndRemove(id).exec();
    return res.json({ message: "Successfully removed the user" });
  } catch (err) {
    return res.json({ error: err.message });
  }
};

export { getAll, findOne, findGroupById, findRoomById, deleteOne };
