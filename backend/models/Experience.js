const mongoose = require("mongoose");
const experienceSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  jobTitle: { type: String, required: true },
  duration: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  logo: { type: String },
});

module.exports = mongoose.model("Experience", experienceSchema);
