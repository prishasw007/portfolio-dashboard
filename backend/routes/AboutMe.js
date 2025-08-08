const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const About = require("../models/About");

//GET all texts
router.get("/", async (req, res) => {
  const texts = await About.find();
  res.json(texts);
});

// Post new text
router.post("/", async (req, res) => {
  const text = new About(req.body);
  await text.save();
  res.json(text);
});

//Update text
router.put("/:id", async (req, res) => {
  const updatedAbout = await About.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.json(updatedAbout);
});

//Delete text by id
router.delete("/:id", async (req, res) => {
  await About.findByIdAndDelete(req.params.id);
  res.json({ message: "About deleted" });
});

// Multer setup for temporary file storage
const storage = multer.memoryStorage(); // memory storage for buffer upload to Cloudinary
const upload = multer({ storage });

router.post("/", upload.single("photo"), async (req, res) => {
  try {
    const about = new AboutMe({
      text: req.body.text,
      photoUrl: req.file ? req.file.path : null, // multer-storage-cloudinary sets path to Cloudinary URL
    });

    const savedAbout = await about.save();
    res.json(savedAbout);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT route to update AboutMe with optional photo upload/removal
router.put("/:id", upload.single("photo"), async (req, res) => {
  try {
    const about = await AboutMe.findById(req.params.id);
    if (!about) return res.status(404).json({ message: "Not found" });

    if (req.body.text !== undefined) about.text = req.body.text;

    if (req.file) {
      about.photoUrl = req.file.path; // multer-storage-cloudinary already uploaded photo and gives URL here
    } else if (req.body.removePhoto === "true") {
      about.photoUrl = null;
    }

    const updatedAbout = await about.save();
    res.json(updatedAbout);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
