const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  category: { type: String, required: true },
  name: { type: String, required: true },
  iconName:{type: String},
  logoUrl: {type: String}, // logos
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Skill', skillSchema);
