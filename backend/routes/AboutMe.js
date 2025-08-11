const express = require("express");
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const About = require("../models/About");

const router = express.Router();

// Multer memory storage (upload buffer directly to Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET all AboutMe entries
router.get("/", async (req, res) => {
  try {
    const aboutList = await About.find();
    res.json(aboutList);
  } catch (err) {
    console.error("Error fetching AboutMe:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST new AboutMe
router.post("/", upload.single("photo"), async (req, res) => {
  try {
    let photoUrl = null;

    if (req.file) {
      // Upload buffer directly to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "portfolio/about-me" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      photoUrl = uploadResult.secure_url;
    }

    const about = new About({
      text: req.body.text || "",
      logo: photoUrl,
    });

    const savedAbout = await about.save();
    res.status(201).json(savedAbout);
  } catch (err) {
    console.error("Error creating AboutMe:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT update AboutMe
router.put("/:id", upload.single("photo"), async (req, res) => {
  try {
    const about = await About.findById(req.params.id);
    if (!about) return res.status(404).json({ message: "AboutMe not found" });

    if (req.body.text !== undefined) {
      about.text = req.body.text;
    }

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "portfolio/about-me" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      about.logo = uploadResult.secure_url;
    } else if (req.body.removePhoto === "true") {
      about.logo = null;
    }

    const updatedAbout = await about.save();
    res.json(updatedAbout);
  } catch (err) {
    console.error("Error updating AboutMe:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE AboutMe
router.delete("/:id", async (req, res) => {
  try {
    await About.findByIdAndDelete(req.params.id);
    res.json({ message: "AboutMe deleted" });
  } catch (err) {
    console.error("Error deleting AboutMe:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
