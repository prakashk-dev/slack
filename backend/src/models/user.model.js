const mongoose = require("mongoose");
const Schema = mongoose.Schema;
import bcrypt from "bcrypt";
import { logger } from "../helpers";

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  pin: {
    type: String,
    select: false,
  },
  password: {
    type: String,
    select: false,
  },
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
  status: {
    type: String,
    enum: ["online", "away", "offline"],
  },
  // last time user logged in
  last_active: "",
  rooms: [
    {
      name: { type: String, unique: true },
      last_active: Date,
      favourite: Boolean,
      role: { type: String, enum: ["admin"] },
    },
  ],
  groups: [
    {
      name: { type: String, unique: true },
      last_active: Date,
      role: { type: String, enum: ["admin"] },
      request: {
        status: { type: String, enum: ["pending", "approved", "rejected"] },
        by: String,
      },
    },
  ],
  friends: [
    {
      friend: { type: Schema.Types.ObjectId, ref: "user" },
      last_active: Date,
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
      },
    },
  ],
  notification: [{ receiver: String, count: Number }], // this contains only those messages that are not seen
});

// write a hook that will always sort the rooms, groups and friends array
// UserSchema.pre('findOne', function() {
//   this.
// })
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
  bcrypt.compare(pin.toString(), this.pin, function (err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

UserSchema.set("toJSON", {
  virtuals: true,
});

UserSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model("user", UserSchema);
