const express = require("express");
const About = require("../models/About");
const upload = require("../middleware/upload");
const router = express.Router();
const cloudinary = require("../utils/cloudinary");

// GET all AboutMe
router.get("/", async (req, res) => {
  try {
    const aboutList = await About.find();
    res.json(aboutList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST new AboutMe with optional photo
router.post("/", upload.single("photo"), async (req, res) => {
  try {
    const about = new About({
      text: req.body.text || "",
      logo: req.file.path || null,  
      publicId: req.file.filename
    });

    const savedAbout = await about.save();
    res.status(201).json(savedAbout);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT update AboutMe
router.put("/:id", upload.single("photo"), async (req, res) => {
  try {
    const about = await About.findById(req.params.id);
    if (!about) return res.status(404).json({ message: "AboutMe not found" });

    if (req.body.text !== undefined) about.text = req.body.text;

    if (req.file) {
      // Delete old photo if exists
      if (about.publicId) {
        await require("../utils/cloudinary").uploader.destroy(about.publicId);
      }

      about.logo = req.file.path;
      about.publicId = req.file.filename;
    }

    const updatedAbout = await about.save();
    res.json(updatedAbout);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE profile photo only
router.delete("/:id/photo", async (req, res) => {
  try {
    const about = await About.findById(req.params.id);
    if (!about) return res.status(404).json({ message: "AboutMe not found" });

    if (about.publicId) {
      await cloudinary.uploader.destroy(about.publicId);
      about.logo = null;
      about.publicId = null;
      await about.save();
    }

    res.json({ message: "Profile photo deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
