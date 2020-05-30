import mongoose from "mongoose";
import moment from "moment";
import { User, Room, Message } from "../models";
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
    return res.json({ name: "Bhetghat", users: [] });
  } else if (!mongoose.Types.ObjectId.isValid(roomId)) {
    return res.json({ error: "Not a valid room id" });
  } else {
    try {
      // only push if the room is not exists

      await User.updateOne(
        { _id: id, "rooms.room": { $ne: roomId } },
        {
          $push: {
            rooms: {
              room: roomId,
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
const fetchUserWithChatHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { friendUserName: username } = req.query;

    // update friend's friendlist with current user and status pending
    let user, friend;
    let friendExists = await User.findOne({
      username,
      "friends.friend": { $eq: id },
    }).exec();
    if (!friendExists) {
      friend = await User.findOneAndUpdate(
        { username, "friends.friend": { $ne: id } },
        {
          $push: {
            friends: {
              friend: id,
              last_active: moment.utc().format(),
              status: "pending",
            },
          },
        },
        { returnOriginal: false }
      )
        .populate("friends.friend")
        .populate("rooms.room")
        .populate("groups.group")
        .exec();

      // Add friend to the current user's friend list
      user = await User.findOneAndUpdate(
        { _id: id, "friends.friend": { $ne: friend.id } },
        {
          $push: {
            friends: {
              friend: friend.id,
              last_active: moment.utc().format(),
              status: "approved",
            },
          },
        },
        { returnOriginal: false }
      ).exec();
    } else {
      user = await User.findById(id)
        .populate("friends.friend")
        .populate("rooms.room")
        .populate("groups.group")
        .exec();
      friend = await User.findOne({ username })
        .populate("friends.friend")
        .populate("rooms.room")
        .populate("groups.group")
        .exec();
    }

    const messages = await Message.find({
      $and: [
        { onReceiver: { $eq: "user" } },
        {
          $or: [
            {
              $and: [{ sender: { $eq: id } }, { receiver: { $eq: friend.id } }],
            },
            {
              $and: [{ sender: { $eq: friend.id } }, { receiver: { $eq: id } }],
            },
          ],
        },
      ],
    }).exec();

    friend = friend.toJSON();
    friend.messages = messages;
    return res.json({ user, friend });
  } catch (err) {
    console.log(err);
    res.json({ error: err.message });
  }
};

const acceptFriendRequest = async (req, res) => {
  const { userId, friendId } = req.params;
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

export {
  getAll,
  findOne,
  findGroupById,
  findRoomById,
  deleteOne,
  fetchUserWithChatHistory,
};
