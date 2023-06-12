const mongoose = require('mongoose');

const languageSchema = new mongoose.Schema({
  guildId: { type: String },
  language: { type: String },
  Channel: { type: String },
});

module.exports = mongoose.model('Language', languageSchema);
