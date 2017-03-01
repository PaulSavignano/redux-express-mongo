import mongoose, { Schema } from 'mongoose'

const TodoModel = mongoose.model('TodoModel', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  },
  _creator: {
    type: Schema.Types.ObjectId,
    required: true,
  }
})

export default TodoModel
