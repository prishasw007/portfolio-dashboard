const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const Skill = require("../models/Skill");

// Multer memory storage for optional icon upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET all skills
router.get("/", async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (err) {
    console.error("Error fetching skills:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", upload.single("icon"), async (req, res) => {
  try {
    const { category, name, iconName } = req.body;
    if (!category || !name) {
      return res
        .status(400)
        .json({ message: "Category and name are required" });
    }

    let logoUrl = null;
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "portfolio/skills" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      logoUrl = uploadResult.secure_url;
    }

    const skillData = {
      category,
      name,
      iconName,
    };
    if (logoUrl) skillData.logoUrl = logoUrl;

    const skill = new Skill(skillData);
    const savedSkill = await skill.save();

    res.status(201).json(savedSkill);
  } catch (err) {
    console.error("Error creating skill:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE skill by ID
router.delete("/:id", async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: "Skill deleted" });
  } catch (err) {
    console.error("Error deleting skill:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
