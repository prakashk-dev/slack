import { Message, User } from "../models";
import { logger } from "../helpers";

const getAll = async (_, res) => {
  try {
    const messages = await Message.find({}).exec();
    return res.json(messages);
  } catch (err) {
    return res.json({ error: err.message });
  }
};
// /api/messages/users/:uuid?uuid={user_ui}
const getByUsers = async (req, res) => {
  const { user_id: senderId } = req.params;
  const { user_id: receiverId } = req.query;
  if (!senderId || !receiverId) {
    return res.json({ error: "Receiver and sender ids needed" });
  }
  try {
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    })
      .sort("created_at")
      .exec();
    return res.json(messages);
  } catch (err) {
    return res.json({ err: err.message });
  }
};

const saveMessage = async (data) => {
  if (data.onReceiver === "user") {
    // we need to check if the user request is still pending or not
    const { sender, receiver } = data;
    const userWithPendingOrRejectedStatus = await User.findOne({
      _id: receiver,
      $and: [
        { "friends.friend": { $eq: sender } },
        {
          $or: [
            { "friends.status": { $eq: "pending" } },
            { "friends.status": { $eq: "rejected" } },
          ],
        },
      ],
    }).exec();
    console.log(
      "User found with status pending",
      userWithPendingOrRejectedStatus
    );
    // userWithPendingOrRejectedStatus is sending to the friend who still has not accepted the request or already rejected
    if (userWithPendingOrRejectedStatus) {
      const userWithNotification = await User.findOne({
        _id: receiver,
        "notification.sender": { $eq: sender },
      }).exec();
      console.log("User already has notification", userWithNotification);
      // if found increment the count else add one
      if (userWithNotification) {
        await User.findOneAndUpdate(
          { _id: receiver, "notification.sender": { $eq: sender } },
          {
            $inc: {
              "notification.$.count": 1,
            },
          }
        ).exec();
      } else {
        await User.findOneAndUpdate(
          { _id: receiver },
          {
            $push: {
              notification: {
                sender: sender,
                count: 1,
              },
            },
          }
        ).exec();
      }
    }
  }
  let message = await Message.create(data);
  const msg = await Message.findOne({ _id: message._id })
    .populate("receiver")
    .populate("sender")
    .exec();
  return msg;
};

const deleteAll = async (_, res) => {
  await Message.deleteMany({}).exec();
  return res.json({ msg: "All messages deleted" });
};

export { getByUsers, saveMessage, getAll, deleteAll };
