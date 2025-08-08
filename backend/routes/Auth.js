const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();

// Load admin creds from env
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH; // hashed password stored

const generateToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Login route only
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check email
    if (email !== ADMIN_EMAIL) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password with bcrypt compare
    const isMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(email);

    res.status(200).json({ token, email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
