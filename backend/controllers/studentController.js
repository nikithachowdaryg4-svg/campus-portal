const Assignment = require('../models/Assignment');
const Mark = require('../models/Mark');
const Notice = require('../models/Notice');
const ClassStatus = require('../models/ClassStatus');
const User = require('../models/User');

// @desc    Get all marks for student
// @route   GET /api/student/marks
// @access  Private/Student
const getMarks = async (req, res) => {
  const marks = await Mark.find({ student: req.user._id })
    .populate('faculty', 'username');
  res.json(marks);
};

// @desc    Get all assignments
// @route   GET /api/student/assignments
// @access  Private/Student
const getAssignments = async (req, res) => {
  const assignments = await Assignment.find()
    .populate('faculty', 'username');
  res.json(assignments);
};

// @desc    Submit assignment
// @route   POST /api/student/assignments/:id/submit
// @access  Private/Student
const submitAssignment = async (req, res) => {
  const { content } = req.body;
  const assignment = await Assignment.findById(req.params.id);

  if (!assignment) {
    return res.status(404).json({ message: 'Assignment not found' });
  }

  const alreadySubmitted = assignment.submissions.find(
    (sub) => sub.student.toString() === req.user._id.toString()
  );

  if (alreadySubmitted) {
    return res.status(400).json({ message: 'Already submitted' });
  }

  assignment.submissions.push({
    student: req.user._id,
    content,
  });

  await assignment.save();
  res.status(201).json({ message: 'Submitted successfully' });
};

// @desc    Get all notices
// @route   GET /api/student/notices
// @access  Private/Student
const getNotices = async (req, res) => {
  const notices = await Notice.find().populate('faculty', 'username');
  res.json(notices);
};

// @desc    Submit class status (happening/free)
// @route   POST /api/student/class-status
// @access  Private/Student
const submitClassStatus = async (req, res) => {
  const { facultyName, status, feedback, time } = req.body;

  const classStatus = await ClassStatus.create({
    student: req.user._id,
    facultyName,
    status,
    feedback,
    time,
  });

  res.status(201).json(classStatus);
};

// @desc    Get all faculties for student form
// @route   GET /api/student/faculties
// @access  Private/Student
const getFaculties = async (req, res) => {
  const faculties = await User.find({ role: 'faculty' }).select('-password');
  res.json(faculties);
};

module.exports = {
  getMarks,
  getAssignments,
  submitAssignment,
  getNotices,
  submitClassStatus,
  getFaculties
};
