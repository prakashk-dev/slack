const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    index: true,
  },
  email: {
    type: String,
    unique: true,
    index: true,
  },
  password: String,
  gender: {
    type: String,
    enum: ["m", "f", "na"], // m => male, f => female, na => not applicable
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
  friends: [{ type: Schema.Types.ObjectId, ref: "user" }],
  messages: [
    {
      user: { type: Schema.Types.ObjectId, ref: "user" },
      text: String,
      timeStamp: Date,
    },
  ],
});

module.exports = mongoose.model("user", UserSchema);
