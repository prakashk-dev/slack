const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    index: true,
  },
  password: String,
  gender: {
    type: String,
    enum: ["male", "female", "na"], // m => male, f => female, na => not applicable
  },
  ageGroup: {
    type: String,
    enum: ["1", "2", "3", "4"],
  },
  location: {
    country: String,
    city: String,
  },
  image: "",
  messages: [
    {
      user: { type: Schema.Types.ObjectId, ref: "user" },
      text: String,
      timeStamp: Date,
    },
  ],
  friends: [{ type: Schema.Types.ObjectId, ref: "user" }],
  groups: [{ type: Schema.Types.ObjectId, ref: "group" }],
});

module.exports = mongoose.model("user", UserSchema);
