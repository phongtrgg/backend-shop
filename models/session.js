const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  cart: {
    type: Array,
    required: true,
    ref: "User",
  },
  timeOnline: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Session", sessionSchema);
