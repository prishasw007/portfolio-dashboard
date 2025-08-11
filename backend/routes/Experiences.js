const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../utils/cloudinary');
const Experience = require('../models/Experience');

// Multer memory storage (upload buffer directly to Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET all experiences
router.get('/', async (req, res) => {
  try {
    const experiences = await Experience.find();
    res.json(experiences);
  } catch (err) {
    console.error('Error fetching experiences:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

//POST expereince
router.post('/', upload.single('logo'), async (req, res) => {
  try {

    let logoUrl = null;

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'portfolio/experience-logos' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      logoUrl = uploadResult.secure_url;
      console.log('Uploaded logo URL:', logoUrl);
    }

    const experienceData = {
      ...req.body,
    };
    if (logoUrl) experienceData.logo = logoUrl;  // <-- use `logo` here to match schema

    const experience = new Experience(experienceData);
    const savedExperience = await experience.save();

    res.status(201).json(savedExperience);  // response will include the logo field now
  } catch (err) {
    console.error('Error creating experience:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



// PUT update experience with optional logo upload or remove
router.put('/:id', upload.single('logo'), async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) return res.status(404).json({ message: 'Experience not found' });

    if (req.body) {
      // Update text fields if any
      Object.keys(req.body).forEach((key) => {
        experience[key] = req.body[key];
      });
    }

    if (req.file) {
      // Upload new logo if file present
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'portfolio/experience-logos' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      experience.logo = uploadResult.secure_url;
    } else if (req.body.removeLogo === 'true') {
      // Remove logo if requested
      experience.logo = null;
    }

    const updatedExperience = await experience.save();
    res.json(updatedExperience);
  } catch (err) {
    console.error('Error updating experience:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE experience by id
router.delete('/:id', async (req, res) => {
  try {
    await Experience.findByIdAndDelete(req.params.id);
    res.json({ message: 'Experience deleted' });
  } catch (err) {
    console.error('Error deleting experience:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
