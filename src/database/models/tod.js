const mongoose = require('mongoose');

const todSchema = new mongoose.Schema({
  guildId: String,
  userId: String
});

module.exports = mongoose.model('Tod', todSchema);
