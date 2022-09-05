const mongoose = require('mongoose')

const TodoSchema = new mongoose.Schema({

  todo: {
    type: String,
    required: true,
  },
  sharedWith: [String],
  completed: {
    type: Boolean,
    required: true,
  },
  userId: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Todo', TodoSchema)
