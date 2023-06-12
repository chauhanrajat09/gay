const mongoose = require('mongoose');

const stalkerSchema = new mongoose.Schema({
  Stalker: { type: String, required: true }, // ID of the user who is stalking
  Victim: { type: String, required: true }, 
  Timestamp: { type: String, required: false },// ID of the user being stalked
  allowed: { type: Boolean, default: false } // Boolean field indicating if stalking is allowed or not
});

module.exports = mongoose.model('stalker', stalkerSchema);
