const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/User"); // make sure this is imported

// Load admin creds from env
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

// Login route
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  // ADMIN LOGIN
  if (email === ADMIN_EMAIL) {
    const match = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (match) {
      const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.json({ message: "Admin login successful" });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  }

  // USER LOGIN
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
