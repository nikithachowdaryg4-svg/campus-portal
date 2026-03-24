const mongoose = require('mongoose');

const classStatusSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  facultyName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['happening', 'free'],
    required: true,
  },
  feedback: {
    type: String, // Feedback attached
  },
  time: {
    type: String,
    required: true, // e.g., "10:00 AM - 11:00 AM"
  }
}, { timestamps: true });

module.exports = mongoose.model('ClassStatus', classStatusSchema);
