import { Message } from "../models";
import moment from "moment";
import { emitMessage, emitThreadMessage } from "../socket/helpers";

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

const saveMessage = async (req, res) => {
  // create a function that handles if a message is valid or not

  let message = await Message.create({
    ...req.body,
    created_at: moment.utc().format(),
  });
  const msg = await Message.findOne({ _id: message._id })
    .populate("receiver")
    .populate("sender")
    .populate("reply.sender")
    .exec();
  emitMessage(msg);
  return res.json(msg);
};

const saveThreadMessage = async (data) => {
  const { thread, reply } = data;
  const message = await Message.findByIdAndUpdate(
    thread,
    {
      $push: {
        reply: {
          sender: reply.sender,
          body: reply.body,
          created_at: moment.utc().format(),
        },
      },
    },
    { new: true }
  )
    .populate("receiver")
    .populate("sender")
    .populate("reply.sender")
    .exec();
  return message;
};

const updateMessageById = async (req, res) => {
  const { id } = req.params;
  // update reply
  if (req.body.reply) {
    const { sender, body } = req.body.reply;
    const message = await Message.findByIdAndUpdate(
      id,
      {
        $push: {
          reply: {
            sender,
            body,
            created_at: moment.utc().format(),
          },
        },
      },
      { new: true }
    )
      .populate("receiver")
      .populate("sender")
      .populate("reply.sender")
      .exec();
    emitThreadMessage({ sender, message});
    return res.json(message);
  } else {
    return res.json({ message: "Successfully updated message" });
  }
};

const deleteMessageById = async (req, res) => {
  const { id } = req.params;
  const currentUser = req.decoded;
  try {
    const count = await Message.deleteOne({
      _id: id,
      sender: { $eq: currentUser.id },
    }).exec();
    return res.json({ deleted: count.deletedCount === 1 });
  } catch (err) {
    return res.json({ error: err.message });
  }
};
const deleteAll = async (_, res) => {
  await Message.deleteMany({}).exec();
  return res.json({ msg: "All messages deleted" });
};

export {
  getByUsers,
  saveMessage,
  getAll,
  deleteAll,
  saveThreadMessage,
  updateMessageById,
  deleteMessageById,
};
