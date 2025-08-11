const mongoose = require("mongoose");
const aboutSchema = new mongoose.Schema({
  text: { type: String, required: true },
  logo: { type: String},
});

module.exports = mongoose.model("About", aboutSchema);