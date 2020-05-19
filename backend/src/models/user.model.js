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
  rooms: [{ type: Schema.Types.ObjectId, ref: "room" }],
  messages: [
    {
      from: { type: Schema.Types.ObjectId, ref: "user" },
      to: { type: Schema.Types.ObjectId, ref: "group" },
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
  friends: [{ type: Schema.Types.ObjectId, ref: "user" }],
  groups: [{ type: Schema.Types.ObjectId, ref: "group" }],
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

UserSchema.post("findOne", function (result) {
  console.log("After finding the document", JSON.stringify(result));
});
module.exports = mongoose.model("user", UserSchema);
