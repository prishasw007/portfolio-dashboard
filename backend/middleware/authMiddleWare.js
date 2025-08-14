const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  // Read JWT from cookie first, then from header
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === "admin") {
      // Admin login case
      req.user = { role: "admin" };
      return next();
    }

    // Regular user
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { protect };
