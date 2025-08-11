const express = require("express");
const upload = require("../middleware/upload");
const cloudinary = require("../utils/cloudinary");

const User = require("../models/About");
const Skill = require("../models/Skill");
const Experience = require("../models/Experience");

const router = express.Router();

// Upload profile photo
router.post("/profile-photo/:id", upload.single("photo"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "portfolio/profile-photos",
    });

    user.profilePhoto = result.secure_url;
    await user.save();

    res.json({ message: "Profile photo updated", url: result.secure_url });
  } catch (err) {
    console.error("Error uploading profile photo:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Upload skill icon
router.post("/skill/:id", upload.single("icon"), async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "portfolio/skills",
    });

    skill.icon = result.secure_url;
    await skill.save();

    res.json({ message: "Skill icon updated", url: result.secure_url });
  } catch (err) {
    console.error("Error uploading skill icon:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Upload experience logo
router.post("/experience/:id", upload.single("logo"), async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) return res.status(404).json({ message: "Experience not found" });

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "portfolio/experience",
    });

    experience.logo = result.secure_url;
    await experience.save();

    res.json({ message: "Company logo updated", url: result.secure_url });
  } catch (err) {
    console.error("Error uploading experience logo:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
