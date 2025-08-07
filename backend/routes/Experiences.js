const express = require('express')
const router = express.Router();
const Experience = require('../models/Experience')

//GET all experiences
router.get('/', async(req,res) => {
  const experiences = await Experience.find();
  res.json(experiences);
});

// Post new experience
router.post('/',async (req,res)=>{
  const experience = new Experience(req.body);
  await experience.save();
  res.json(experience);
});

//Update experience
router.put('/:id', async (req, res) => {
  const updatedExperience = await Experience.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  res.json(updatedExperience);
});

//Delete experience by id
router.delete('/:id', async (req,res) =>{
  await Experience.findByIdAndDelete(req.params.id);
  res.json({message: 'Experience deleted'});
});

module.exports = router;