const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    cpassword: String,
    mobile: String,
    address: String
})


module.exports = mongoose.model("User", userSchema, "users")