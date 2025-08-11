const mongoose = require("mongoose");
const AccountSchema = new mongoose.Schema({
  name: { type: String },
  linkedin: { type: String },
  email: { type: String },
  github: { type: String },
  typewriterWords: { type: String },
});

module.exports = mongoose.model('AccountSetting',AccountSchema);
