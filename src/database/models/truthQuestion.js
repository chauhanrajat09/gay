const mongoose = require('mongoose');

// Connect to MongoDB server
const Schema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  rating: { type: String, required: true },
  question: { type: String, required: true },
  translations: {
    bn: String,
    de: String,
    es: String,
    fr: String,
    hi: String,
    tl: String
  }
});

// Use 'truth_collection' as the collection name for this model
const TruthQuestion = mongoose.model('Truth_Question', Schema);

module.exports = TruthQuestion;
