const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema({
  title: { type: String, require: true },
  description: { type: String, require: true },
  githubLink: { type: String },
  websiteLink: { type: String },
  languagesUsed: { type: String, require: true },
});

module.exports = mongoose.model("Project", projectSchema);
