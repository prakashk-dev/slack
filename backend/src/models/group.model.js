import mongoose from "mongoose";

const Schema = mongoose.Schema;

const GroupSchema = new Schema({
  name: String,
  users: [{ type: Schema.Types.ObjectId, ref: "user" }],
  description: String,
  image: String,
  messages: [
    {
      user: { type: Schema.Types.ObjectId, ref: "user" },
      group: { type: Schema.Types.ObjectId, ref: "group" },
      timeStamp: Date,
    },
  ],
  timeStamp: Date,
});

module.exports = mongoose.model("group", GroupSchema);
