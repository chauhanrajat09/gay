const mongoose = require('mongoose');

const AutorespondSchema = new mongoose.Schema({
  Guild: String,
  Keyword: String,
  Response: String,
});

module.exports = mongoose.model("Autorespond", AutorespondSchema);
