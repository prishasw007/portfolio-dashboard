const express = require("express");
const upload = require("../middleware/multer");
const User = require("../models/About");
const Skill = require("../models/Skill");
const Experience = require("../models/Experience");

const router = express.Router();

// Upload profile photo
router.post("/profile-photo/:id", upload.single("photo"), async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.profilePhoto = req.file.path;
  await user.save();
  res.json({ message: "Profile photo updated", url: req.file.path });
});

// Upload skill icon
router.post("/skill/:id", upload.single("icon"), async (req, res) => {
  const skill = await Skill.findById(req.params.id);
  if (!skill) return res.status(404).json({ message: "Skill not found" });

  skill.icon = req.file.path;
  await skill.save();
  res.json({ message: "Skill icon updated", url: req.file.path });
});

// Upload experience logo
router.post("/experience/:id", upload.single("logo"), async (req, res) => {
  const experience = await Experience.findById(req.params.id);
  if (!experience) return res.status(404).json({ message: "Experience not found" });

  experience.logo = req.file.path;
  await experience.save();
  res.json({ message: "Company logo updated", url: req.file.path });
});

module.exports = router;
