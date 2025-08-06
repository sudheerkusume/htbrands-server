const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  _id: String, // manually store _id from frontend product
  title: String,
  image: String,
  price: Number,
  quantity: {
    type: Number,
    default:1,
  },
  size: {
    type: String,
    default: "Free Size"
  },

});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Fuser", // your user model
    required: true,
  },
  items: [cartItemSchema],
});

module.exports = mongoose.model("Cart", cartSchema);
