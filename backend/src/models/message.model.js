import mongoose from "mongoose";
import moment from "moment";

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: "user" },
  //   receiver can be user, group or room
  receiver: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: "onReceiver",
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
    default: moment.utc().format(),
  },
  updated_at: Date,
  reply: [
    {
      sender: { type: Schema.Types.ObjectId, ref: "user" },
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
        default: moment.utc().format(),
      },
      updated_at: Date,
    },
  ],
  onReceiver: {
    type: String,
    required: true,
    enum: ["room", "group", "user"],
  },
});

// alwyas populate sender and receiver while requesting message
MessageSchema.pre("find", function () {
  this.populate("sender").populate("receiver").populate("reply.sender");
});

MessageSchema.set("toJSON", {
  virtuals: true,
});

MessageSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model("message", MessageSchema);
