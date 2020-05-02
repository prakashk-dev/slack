import mongoose from "mongoose";

const Schema = mongoose.Schema;

const GroupSchema = new Schema({
  name: String,
  description: String,
  image: String,
  users: [{ type: Schema.Types.ObjectId, ref: "user" }],
  messages: [
    {
      user: { type: Schema.Types.ObjectId, ref: "user" },
      text: String,
      timeStamp: Date,
    },
  ],
  timeStamp: Date,
});

module.exports = mongoose.model("group", GroupSchema);
