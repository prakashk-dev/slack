import mongoose from "mongoose";
import moment from "moment";

const Schema = mongoose.Schema;

const GroupSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    description: String,
    image: String,
    users: [{ type: Schema.Types.ObjectId, ref: "user" }],
    messages: [{ type: Schema.Types.ObjectId, ref: "message" }],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
      currentTime: () => moment.utc().format(),
    },
  }
);
GroupSchema.virtual(
  "users",
  {
    ref: "user",
    localField: "name",
    foreignField: "rooms.name",
    justOne: false,
    // https://mongoosejs.com/docs/api.html#query_Query-setOptions
    options: { sort: { "groups.last_active": 1 } },
  },
  { toJSON: { virtuals: true } }
);

GroupSchema.virtual(
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

module.exports = mongoose.model("group", GroupSchema);
