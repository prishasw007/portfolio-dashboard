const express = require('express')
const router = express.Router();
const About = require('../models/About')

//GET all texts
router.get('/', async(req,res) => {
  const texts = await About.find();
  res.json(texts);
});

// Post new text
router.post('/',async (req,res)=>{
  const text = new About(req.body);
  await text.save();
  res.json(text);
});

//Update text
router.put('/:id', async (req, res) => {
  const updatedAbout = await About.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  res.json(updatedAbout);
});

//Delete text by id
router.delete('/:id', async (req,res) =>{
  await About.findByIdAndDelete(req.params.id);
  res.json({message: 'About deleted'});
});

module.exports = router;