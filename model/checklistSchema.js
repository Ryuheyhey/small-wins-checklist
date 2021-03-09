const mongoose = require('mongoose')

const checklistSchema = new mongoose.Schema({
  title: {
    type: String
  },
  content_1: {
    type: String
  },
  content_2: {
    type: String
  },
  content_3: {
    type: String
  },
  content_4: {
    type: String
  },
  created: {
    type: Date
  }
})

module.exports = checklistSchema