const mongoose = require("mongoose");
const Schema = mongoose.Schema;
import bcrypt from "bcryptjs";
import moment from "moment";
import { logger } from "../helpers";

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  full_name: String,
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
      room: { type: Schema.Types.ObjectId, ref: "room" },
      last_active: { type: Date, default: moment.utc().format() },
      favourite: Boolean,
      role: { type: String, enum: ["admin"] },
    },
  ],
  groups: [
    {
      group: { type: Schema.Types.ObjectId, ref: "group" },
      last_active: { type: Date, default: moment.utc().format() },

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
      last_active: { type: Date, default: moment.utc().format() },

      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
      },
    },
  ],
  notification: [{ receiver: Schema.Types.ObjectId, count: Number }], // this contains only those messages that are not seen
});

// write a hook that will always sort the rooms, groups and friends array
// UserSchema.pre('findOne', function() {
//   this.
// })
// create a virtual that gets all the private messages for this user
// either receiver or sender must be this._id and must have onReceiver as user
// UserSchema.virtual('messages', {
//   ref: 'message',

// })
UserSchema.pre("save", function (next) {
  let user = this;
  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

UserSchema.methods.comparePassword = function (password, cb) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
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
