const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  submissions: [
    {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      content: String,
      submittedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
