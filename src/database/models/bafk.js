const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  User: String,
  Message: String,
  Timestamp: Number, // Timestamp property added here
});;

module.exports = mongoose.model("bafk", Schema);