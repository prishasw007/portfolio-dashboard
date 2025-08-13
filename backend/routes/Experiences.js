const express = require("express");
const Experience = require("../models/Experience");
const upload = require("../middleware/upload");
const cloudinary = require("../utils/cloudinary");
const router = express.Router();

// GET all experiences
router.get("/", async (req, res) => {
  try {
    const experiences = await Experience.find();
    res.json(experiences);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST new experience with optional logo
router.post("/", upload.single("logo"), async (req, res) => {
  try {
    const experience = new Experience({
      companyName: req.body.companyName,
      jobTitle: req.body.jobTitle,
      duration: req.body.duration,
      location: req.body.location,
      description: req.body.description,
      logo: req.file?.path || null,
      publicId: req.file?.filename || null,
    });

    const savedExperience = await experience.save();
    res.status(201).json(savedExperience);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT update experience with optional logo
router.put("/:id", upload.single("logo"), async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience)
      return res.status(404).json({ message: "Experience not found" });

    // Update text fields
    ["companyName", "jobTitle", "duration", "location", "description"].forEach(
      (key) => {
        if (req.body[key] !== undefined) experience[key] = req.body[key];
      }
    );

    // Update logo if uploaded
    if (req.file) {
      // Delete old logo if exists
      if (experience.publicId) {
        await cloudinary.uploader.destroy(experience.publicId);
      }
      experience.logo = req.file.path;
      experience.publicId = req.file.filename;
    }

    const updatedExperience = await experience.save();
    res.json(updatedExperience);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE experience
router.delete("/:id", async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience)
      return res.status(404).json({ message: "Experience not found" });

    // Delete logo from Cloudinary if exists
    if (experience.publicId) {
      await cloudinary.uploader.destroy(experience.publicId);
    }

    await experience.deleteOne();
    res.json({ message: "Experience deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE only the logo
router.delete("/:id/logo", async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience)
      return res.status(404).json({ message: "Experience not found" });

    if (experience.publicId) {
      await cloudinary.uploader.destroy(experience.publicId);
      experience.logo = null;
      experience.publicId = null;
      await experience.save();
    }

    res.json({ message: "Logo deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
