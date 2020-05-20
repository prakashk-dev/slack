import { RoomModel, UserModel } from "../models";
import Data from "./data";

const seed = async (req, res) => {
  try {
    const { rooms } = Data;
    const room = await RoomModel.findOne({ name: rooms[0].name }).exec();
    if (room) {
      return res.json({ msg: "Data Already Inserted" });
    } else {
      await RoomModel.insertMany(rooms);
      return res.json({ msg: "Room data successfully inserted." });
    }
  } catch (err) {
    return res.json({ error: err.message });
  }
};

const unseed = async (req, res) => {
  try {
    await RoomModel.deleteMany({});
    await UserModel.deleteMany({});
    return res.json({ msg: "Successfully deleted all the documents." });
  } catch (e) {
    return res.json({ error: e.message });
  }
};

export { seed, unseed };
