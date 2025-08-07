const mongoose = require('mongoose');
const contactMessageSchema = new mongoose.Schema({
  name: {type: String},
  email: {type:String},
  message: {type:String},
  receivedAt: {type:Date, default: Date.now()}
});

module.exports = mongoose.model('ContactMessage',contactMessageSchema);