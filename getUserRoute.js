const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const routeAuth1 = require("./routeAuth1");
const User = require("./model/FuserModel"); // or UserModel depending on your structure

router.get("/getuser", routeAuth1, async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // ✅ use req.user.id
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
