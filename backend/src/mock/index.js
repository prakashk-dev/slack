import { Room, User, Message } from "../models";
import Data from "./data";

const seed = async (req, res) => {
  try {
    const { rooms } = Data;
    const room = await Room.findOne({ name: rooms[0].name }).exec();
    if (room) {
      return res.json({ msg: "Data Already Inserted" });
    } else {
      await Room.insertMany(rooms);
      return res.json({ msg: "Room data successfully inserted." });
    }
  } catch (err) {
    return res.json({ error: err.message });
  }
};

const unseed = async (req, res) => {
  try {
    await Room.deleteMany({});
    await User.deleteMany({});
    await Message.deleteMany({});
    return res.json({ msg: "Successfully deleted all the documents." });
  } catch (e) {
    return res.json({ error: e.message });
  }
};

export { seed, unseed };
