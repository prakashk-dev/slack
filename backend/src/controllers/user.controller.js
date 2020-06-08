import mongoose from "mongoose";
import moment from "moment";
import { User, Room, Message } from "../models";
import { _getOneById } from "./room.controller";
import { logger } from "../helpers";
import { getIO, getSocket, isOnline } from "../socket/data";

// get all users
const getAll = async (req, res) => {
  try {
    const users = await User.find().populate("rooms.room").exec();
    return res.json(users);
  } catch (err) {
    return res.status(400).json({ error: "Error Fetching User" });
  }
};
// /:id
async function findOne(req, res) {
  const { id } = req.params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.json({
      error: "Either user id is missing or is not a valid user id.",
    });
  }
  try {
    let user = await User.findById(id)
      .populate("rooms.room")
      .populate("groups.group")
      .populate("friends.friend")
      .exec();

    user.status = "online";
    await user.save();
    sendOnlineStatus(user);
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
    return res.json({ room: { name: "Bhetghat", users: [] } });
  } else if (!mongoose.Types.ObjectId.isValid(roomId)) {
    return res.json({ error: "Not a valid room id" });
  } else {
    try {
      const user = await User.findById(id).exec();

      let foundAt;
      let exists = user.rooms.find((room, index) => {
        foundAt = index;
        return room.room == roomId;
      });
      if (exists) {
        // fresh added fav room
        if (!exists.favourite) {
          user.rooms.splice(foundAt, 1);
          user.rooms.unshift({
            room: exists.room,
            last_active: moment.utc().format(),
          });
        } else {
          user.rooms[foundAt] = {
            room: exists.room,
            favourite: exists.favourite,
            last_active: moment.utc().format(),
          };
        }
      } else {
        user.rooms.unshift({
          room: roomId,
          last_active: moment.utc().format(),
        });
        updateRoomUsers(roomId, user);
      }
      await user.save();
      const updatedUser = await User.findById(id)
        .populate("rooms.room")
        .populate("groups.group")
        .populate("friends.friend")
        .exec();

      const room = await _getOneById(roomId);
      // the user.rooms contains the newly added room
      return res.json({ user: updatedUser, room });
    } catch (err) {
      console.log("Error Message", err);
      return res.json({ error: err.message });
    }
  }
};

const updateRoomById = async (req, res) => {
  const { roomId, id } = req.params;
  let updateObj = {};
  Object.keys(req.body).forEach((key) => {
    updateObj[`rooms.$.${key}`] = req.body[key];
  });
  console.log("Update Obj", req.body);
  try {
    if (!roomId || !id) {
      return res.json({ error: "Either roomId or userId missing" });
    }
    let user = await User.findOneAndUpdate(
      { _id: id, "rooms.room": { $eq: roomId } },
      {
        $set: updateObj,
      },
      { new: true }
    )
      .populate("friends.friend")
      .populate("rooms.room")
      .populate("groups.group")
      .exec();
    if (user) {
      user = user.toJSON();
      const room = user.rooms.find(({ room }) => room.id == roomId);
      return res.json(room);
    } else {
      return res.json({
        error: `User not found with id ${id} and room id ${roomId}`,
      });
    }
  } catch (err) {
    return res.json({ error: err.message });
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
        { username },
        {
          $push: {
            friends: {
              friend: id,
              last_active: moment.utc().format(),
              status: "pending",
            },
          },
        },
        { new: true }
      )
        .populate("friends.friend")
        .populate("rooms.room")
        .populate("groups.group")
        .exec();

      // todo only send current friend
      updateFriendList(friend);

      // Add friend to the current user's friend list
      user = await User.findOneAndUpdate(
        { _id: id },
        {
          $push: {
            friends: {
              friend: friend.id,
              last_active: moment.utc().format(),
              status: "approved",
            },
          },
        },
        { new: true }
      )
        .populate("friends.friend")
        .populate("rooms.room")
        .populate("groups.group")
        .exec();
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
    })
      .populate("sender")
      .populate("receiver")
      .populate("reply.sender")
      .exec();

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

// helper functions
const updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { receiver, count, onReceiver } = req.body;
    let user;
    if (count !== undefined) {
      // user has seen the message, so change status to accepted
      if (onReceiver === "user") {
        user = await User.findOneAndUpdate(
          { _id: id, "friends.friend": receiver },
          {
            $set: {
              "friends.$.status": "approved",
              "friends.$.last_active": moment.utc().format(),
            },
          },
          {
            new: true,
          }
        )
          .populate("friends.friend")
          .exec();
        // todo only send update friend from user.friends
        updateFriendList(user);
      }
      user = await User.findByIdAndUpdate(
        id,
        {
          $pull: {
            notification: {
              receiver: { $eq: receiver },
            },
          },
        },
        {
          new: true,
        }
      ).exec();
    } else {
      const userWithNotification = await User.findOne({
        _id: id,
        "notification.receiver": { $eq: receiver },
      }).exec();

      // if found increment the count else add one
      if (userWithNotification) {
        user = await User.findOneAndUpdate(
          { _id: id, "notification.receiver": { $eq: receiver } },
          {
            $inc: {
              "notification.$.count": 1,
            },
          },
          { new: true }
        ).exec();
      } else {
        user = await User.findByIdAndUpdate(
          id,
          {
            $push: {
              notification: {
                receiver: receiver,
                count: 1,
              },
            },
          },
          {
            new: true,
          }
        ).exec();
      }
    }
    return res.json(user);
  } catch (err) {
    return res.json({ error: err.message });
  }
};

const updateOneById = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).exec();
    if (req.body.status) {
      sendOnlineStatus(user);
      return res.json({ message: "Successfully updated" });
    }
    return res.json(user);
  } catch (err) {
    return res.json({ error: err.message });
  }
};

// helpers function
const updateFriendList = (user) => {
  try {
    const socket = getSocket(user._id);
    if (socket) {
      getIO().to(socket.id).emit("updateFriendList", user);
    }
  } catch (err) {
    console.log("Error updateFriendList", err);
  }
};

const updateRoomUsers = (roomId, user) => {
  try {
    getIO().in(roomId).emit("updateRoomUsers", user);
  } catch (err) {
    console.log("Error updateRoomUsers", err);
  }
};

const sendOnlineStatus = (user) => {
  try {
    if (user.friends.length) {
      user.friends.forEach(({ friend }) => {
        const friendSocket = getSocket(friend._id);
        if (friendSocket) {
          getIO()
            .to(friendSocket.id)
            .emit("userOnline", { id: user._id, status: user.status });
        }
      });
    }
  } catch (err) {
    console.log("Error updateRoomUsers", err);
  }
};

export {
  getAll,
  findOne,
  findGroupById,
  findRoomById,
  deleteOne,
  fetchUserWithChatHistory,
  updateRoomUser,
  updateNotification,
  sendOnlineStatus,
  updateOneById,
  updateRoomById,
};
