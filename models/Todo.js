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
  },
  dateCreated: {
    type: String,
    required:true
  },
  dateCompleted: {
    type: String
  }
})

module.exports = mongoose.model('Todo', TodoSchema)
