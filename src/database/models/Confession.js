const mongoose = require('mongoose');

const confessionSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true
  },
  channelId: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Confession", confessionSchema);
