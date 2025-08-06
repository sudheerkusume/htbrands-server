const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  const token = req.header("x-token");
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, "adminsecret"); // ✅ Must match admin login
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid admin token" });
  }
};

module.exports = adminAuth;