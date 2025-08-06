const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  items: {
    type: Array,
    required: true,
  },
  address: {
    type: Object, // ✅ Change from String to Object
    required: true,
  },
  paymentMode: {
    type: String,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
