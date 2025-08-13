const express = require("express");
const Skill = require("../models/Skill");
const upload = require("../middleware/upload");
const cloudinary = require("../utils/cloudinary");
const router = express.Router();

// GET all skills
router.get("/", async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST new skill (optional logo)
router.post("/", upload.single("logo"), async (req, res) => {
  try {
    const skillData = {
      category: req.body.category,
      name: req.body.name,
      iconName: req.body.iconName || null,
      logoUrl: req.file?.path || null,
      publicId: req.file?.filename || null,
    };

    const skill = new Skill(skillData);
    const savedSkill = await skill.save();
    res.status(201).json(savedSkill);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT update skill (optional logo)
router.put("/:id", upload.single("logo"), async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });

    // Update text fields
    ["category", "name", "iconName"].forEach((key) => {
      if (req.body[key] !== undefined) skill[key] = req.body[key];
    });

    // Update logo if uploaded
    if (req.file) {
      if (skill.publicId) {
        await cloudinary.uploader.destroy(skill.publicId);
      }
      skill.logoUrl = req.file.path;
      skill.publicId = req.file.filename;
    }

    const updatedSkill = await skill.save();
    res.json(updatedSkill);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE skill entirely
router.delete("/:id", async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });

    if (skill.publicId) {
      await cloudinary.uploader.destroy(skill.publicId);
    }

    await skill.deleteOne();
    res.json({ message: "Skill deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE only the skill logo
router.delete("/:id/logo", async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });

    if (skill.publicId) {
      await cloudinary.uploader.destroy(skill.publicId);
      skill.logoUrl = null;
      skill.publicId = null;
      await skill.save();
    }

    res.json({ message: "Logo deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
