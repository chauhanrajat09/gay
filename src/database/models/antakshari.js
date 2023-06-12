const mongoose = require('mongoose');

const antakshariSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  guildId: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Antakshari', antakshariSchema);
