import { RoomModel, UserModel } from "../models";
import Data from "./data";

const seed = async (req, res) => {
  try {
    const { rooms } = Data;
    const room = await RoomModel.findOne({ name: rooms[0].name }).exec();

    const insertRoomData = async () => {
      let msg;
      if (room) {
        msg = "Room data already exists.";
      } else {
        // push some user ids to the dummy rooms data
        try {
          await RoomModel.insertMany(rooms);
          msg = "Room data successfully inserted.";
        } catch (err) {
          msg = err.message;
        }
      }
      return { msg };
    };
    const result = await insertRoomData();
    return result;
  } catch (err) {
    console.error("Error inserting data into the database", err.message);
    return { error: err.message };
  }
};

const unseed = async (req, res) => {
  try {
    await RoomModel.deleteMany({});
    await UserModel.deleteMany({});
    return { msg: "Successfully deleted all the documents." };
  } catch (e) {
    return { error: e.message };
  }
};

export { seed, unseed };
