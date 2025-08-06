// const jwt = require("jsonwebtoken");
// const FuserModel = require('./model/FuserModel'); // ✅ Correct

// const routeAuth1 = async (req, res, next) => {
//   const token = req.header("x-token");
//   console.log("🔐 Received token:", token);

//   if (!token) return res.status(401).send("Access denied. No token provided");

//   try {
//     const decoded = jwt.verify(token, "jsonSecret");
//     console.log("✅ Decoded JWT payload:", decoded);
//     req.user = decoded.user;

//     // Optional: Validate existence in DB
//     const userExists = await FuserModel.findById(req.user.id);
//     if (!userExists) return res.status(400).send("User not found in FuserModel");

//     console.log("✅ req.user from token:", req.user);
//     next();
//   } catch (err) {
//     console.log("❌ JWT Error:", err.message);
//     res.status(400).send("Invalid token");
//   }
// };

// module.exports = routeAuth1;

// middleware/routeAuth1.js

const jwt = require("jsonwebtoken");

const routeAuth1 = (req, res, next) => {
  const token = req.header("x-token");
  if (!token) return res.status(401).send("Access denied. No token provided");

  try {
    const decoded = jwt.verify(token, "jsonSecret");
    console.log("✅ Decoded JWT:", decoded); // 👈 ADD THIS LINE
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
};

module.exports = routeAuth1;
