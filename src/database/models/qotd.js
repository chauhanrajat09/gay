const mongoose = require('mongoose');

const qotdSchema = new mongoose.Schema({
  guild: String,
  user: String,
  question: String,
});

module.exports = mongoose.model("qotd", qotdSchema);
