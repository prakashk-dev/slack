import mongoose from "mongoose";
import moment from "moment";

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: "user" },
  //   receiver can be user, group or room
  receiver: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: "onSender",
  },
  body: {
    type: {
      type: String,
      enum: ["image", "video", "icon", "text", "file"],
    },
    text: String,
    url: String,
  },
  pinned: Boolean,
  created_at: {
    type: Date,
    default: moment.utc().format,
  },
  updated_at: Date,
  reply: [
    {
      from: { type: Schema.Types.ObjectId, ref: "user" },
      body: {
        type: {
          type: String,
          enum: ["image", "video", "icon", "text", "file"],
        },
        text: String,
        url: String,
      },
      created_at: {
        type: Date,
        default: moment.utc().format,
      },
      updated_at: Date,
    },
  ],
  onSender: {
    type: String,
    required: true,
    enum: ["room", "group", "user"],
  },
});

// alwyas populate sender and receiver while requesting message
MessageSchema.pre("find", function () {
  this.populate("sender").populate("receiver");
});

module.exports = mongoose.model("message", MessageSchema);
