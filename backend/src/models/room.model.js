import mongoose from "mongoose";

const Schema = mongoose.Schema;

const RoomSchema = new Schema({
  name: {
    type: String,
    unique: true,
  },
  description: String,
  image: String,
  users: [{ type: Schema.Types.ObjectId, ref: "user" }],
  // create a separate document
  messages: [
    {
      from: { type: Schema.Types.ObjectId, ref: "user" },
      to: { type: Schema.Types.ObjectId, ref: "room" },
      message: {
        type: {
          type: String,
          enum: ["image", "video", "icon", "text", "file"],
        },
        text: String,
        url: String,
      },
      timeStamp: Date,
    },
  ],
  timeStamp: Date,
});

module.exports = mongoose.model("room", RoomSchema);
