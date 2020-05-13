import mongoose from "mongoose";

const Schema = mongoose.Schema;

const GroupSchema = new Schema({
  name: {
    type: String,
    unique: true,
  },
  description: String,
  image: String,
  users: [{ type: Schema.Types.ObjectId, ref: "user" }],
  messages: [
    {
      user: { type: Schema.Types.ObjectId, ref: "user" },
      message: {
        type: { type: String },
        text: String,
        url: String,
      },
      timeStamp: Date,
    },
  ],
  timeStamp: Date,
});

module.exports = mongoose.model("group", GroupSchema);
