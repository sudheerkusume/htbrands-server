const mongoose = require("mongoose");

const fuserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  cpassword: String,
  mobile: String,
  address: String,
  cart: {
    type: Array,
    default: []
  }
});

module.exports = mongoose.model("Fuser", fuserSchema, "fusers");