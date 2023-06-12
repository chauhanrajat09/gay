const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  Guild: String,
  User: String,
  Message: String,
  Timestamp: Number, // Timestamp property added here
});;

module.exports = mongoose.model("afk", Schema);