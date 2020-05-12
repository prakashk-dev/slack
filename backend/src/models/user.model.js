const mongoose = require("mongoose");
const Schema = mongoose.Schema;
import bcrypt from "bcrypt";

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    index: true,
  },
  pin: String, // as it is hashed
  roles: [],
  gender: {
    type: String,
    enum: ["male", "female", "na"],
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
});

UserSchema.pre("save", function (next) {
  let user = this;
  if (this.isModified("pin") || this.isNew) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return next(err);
      }
      const convertToString = user.pin.toString();
      bcrypt.hash(convertToString, salt, function (err, hash) {
        if (err) {
          return next(err);
        }
        user.pin = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

UserSchema.methods.comparePassword = function (pin, cb) {
  // const convertToString = pin.toString();
  bcrypt.compare(pin, this.pin, function (err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};
module.exports = mongoose.model("user", UserSchema);
