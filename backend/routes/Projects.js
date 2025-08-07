const express = require('express')
const router = express.Router();
const Project = require('../models/Project')

//GET all projects
router.get('/', async(req,res) => {
  const projects = await Project.find();
  res.json(projects);
});

// Post new Project
router.post('/',async (req,res)=>{
  const project = new Project(req.body);
  await project.save();
  res.json(project);
});

//Update project
router.put('/:id', async (req, res) => {
  const updatedProject = await Project.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  res.json(updatedProject);
});

//Delete project by id
router.delete('/:id', async (req,res) =>{
  await Project.findByIdAndDelete(req.params.id);
  res.json({message: 'Project deleted'});
});

module.exports = router;