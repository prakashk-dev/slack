import mongoose from "mongoose";
import moment from "moment";
import { logger } from "../helpers";

const Schema = mongoose.Schema;

const RoomSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    description: String,
    image: String,
    category: String,
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
      currentTime: () => moment.utc().format(),
    },
  }
);

// these fields are large array and we don't want to store them, instead use virtuals methods to fetch users
// https://docs.mongodb.com/manual/tutorial/model-referenced-one-to-many-relationships-between-documents/

RoomSchema.virtual("users", {
  ref: "user",
  localField: "_id",
  foreignField: "rooms.room",
  justOne: false,
  // https://mongoosejs.com/docs/api.html#query_Query-setOptions
  // options: { sort: { "room.last_active": 1 } },
});

RoomSchema.virtual("messages", {
  ref: "message",
  localField: "_id",
  foreignField: "receiver",
  justOne: false,
  // https://mongoosejs.com/docs/api.html#query_Query-setOptions
  options: { sort: { created_at: 1 } },
});

RoomSchema.set("toJSON", {
  virtuals: true,
});

RoomSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model("room", RoomSchema);
