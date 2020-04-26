import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: String,
  users: [{ type: Schema.Types.ObjectId, ref: "user" }],
});

module.exports = mongoose.model("group", UserSchema);
