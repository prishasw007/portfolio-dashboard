const express = require("express");
const { protect } = require("../middleware/authMiddleWare");
const router = express.Router();

// GET dashboard data
router.get("/", protect, async (req, res) => {
  res.json({ message: `Welcome ${req.user.email}` });
});

// You can protect your other CRUD routes the same way
module.exports = router;