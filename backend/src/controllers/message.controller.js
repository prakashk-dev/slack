import { Message } from "../models";

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
        { from: senderId, "to.user": receiverId },
        { from: receiverId, "to.user": senderId },
      ],
    })
      .sort("created_at")
      .populate("from")
      .populate("to.user")
      .exec();
    return res.json(messages);
  } catch (err) {
    return res.json({ err: err.message });
  }
};

export { getByUsers };
