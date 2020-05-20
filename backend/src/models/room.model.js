import mongoose from "mongoose";
import moment from "moment";

const Schema = mongoose.Schema;

const RoomSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    description: String,
    image: String,
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

RoomSchema.virtual(
  "users",
  {
    ref: "user",
    localField: "name",
    foreignField: "rooms.name",
    justOne: false,
    // https://mongoosejs.com/docs/api.html#query_Query-setOptions
    options: { sort: { "room.last_active": 1 } },
  },
  { toJSON: { virtuals: true } }
);

RoomSchema.virtual(
  "messages",
  {
    ref: "message",
    localField: "name",
    foreignField: "receiver",
    justOne: false,
    // https://mongoosejs.com/docs/api.html#query_Query-setOptions
    options: { sort: { created_at: 1 } },
  },
  { toJSON: { virtuals: true } }
);

module.exports = mongoose.model("room", RoomSchema);
