const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  items: { type: Array, required: true },
  user: {
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  total: {
    type: Number,
    required: true,
  },
  delivery: { type: String, required: true },
  status: { type: String, required: true },
});

module.exports = mongoose.model("Order", orderSchema);
