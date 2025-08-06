const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // Optional: Add more fields like name, role, etc.
  role: {
    type: String,
    default: "admin",
  }
});

module.exports = mongoose.model("Admin", AdminSchema);
