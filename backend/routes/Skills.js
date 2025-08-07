const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');

// GET all skills
router.get('/', async (req, res) => {
  const skills = await Skill.find();
  res.json(skills);
});

// POST new skill
router.post('/', async (req, res) => {
  const skill = new Skill(req.body);
  await skill.save();
  res.json(skill);
});

// DELETE skill by ID
router.delete('/:id', async (req, res) => {
  await Skill.findByIdAndDelete(req.params.id);
  res.json({ message: 'Skill deleted' });
});

module.exports = router;
