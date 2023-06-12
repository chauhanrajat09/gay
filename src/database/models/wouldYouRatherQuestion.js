const mongoose = require('mongoose');

const wouldYouRatherSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true
  },
  rating: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  option1: {
    type: String,
    required: true
  },
  option2: {
    type: String,
    required: true
  },
  translations: {
    type: {
      es: {
        question: String,
        option1: String,
        option2: String
      },
      fr: {
        question: String,
        option1: String,
        option2: String
      },
      hi: {
        question: String,
        option1: String,
        option2: String
      }
    },
    required: true
  }
});

module.exports = mongoose.model('WouldYouRather', wouldYouRatherSchema);
