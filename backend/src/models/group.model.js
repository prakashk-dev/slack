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
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
      currentTime: () => moment.utc().format(),
    },
  }
);
GroupSchema.virtual("members", {
  ref: "user",
  localField: "_id",
  foreignField: "groups.group",
  justOne: false,
  // https://mongoosejs.com/docs/api.html#query_Query-setOptions
  options: { sort: { "groups.last_active": 1 } },
});

GroupSchema.virtual("conversations", {
  ref: "message",
  localField: "_id",
  foreignField: "receiver",
  justOne: false,
  // https://mongoosejs.com/docs/api.html#query_Query-setOptions
  options: { sort: { created_at: 1 } },
});

GroupSchema.set("toJSON", {
  virtuals: true,
});

GroupSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});
module.exports = mongoose.model("group", GroupSchema);
