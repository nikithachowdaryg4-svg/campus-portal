const Assignment = require('../models/Assignment');
const Mark = require('../models/Mark');
const Notice = require('../models/Notice');
const ClassStatus = require('../models/ClassStatus');

// @desc    Create new assignment
// @route   POST /api/faculty/assignments
// @access  Private/Faculty
const createAssignment = async (req, res) => {
  const { title, description, deadline } = req.body;

  const assignment = await Assignment.create({
    title,
    description,
    deadline,
    faculty: req.user._id,
  });

  res.status(201).json(assignment);
};

// @desc    Assign marks to student
// @route   POST /api/faculty/marks
// @access  Private/Faculty
const assignMark = async (req, res) => {
  try {
    const { studentId, subject, score, total } = req.body;
    const User = require('../models/User');

    const studentUser = await User.findOne({ username: studentId, role: 'student' });

    if (!studentUser) {
      return res.status(404).json({ message: 'Student not found with that username' });
    }

    const mark = await Mark.create({
      student: studentUser._id,
      faculty: req.user._id,
      subject,
      score,
      total: total || 100,
    });

    res.status(201).json(mark);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to notice board
// @route   POST /api/faculty/notices
// @access  Private/Faculty
const addNotice = async (req, res) => {
  const { title, content } = req.body;

  const notice = await Notice.create({
    title,
    content,
    faculty: req.user._id,
  });

  res.status(201).json(notice);
};

// @desc    Get free periods / class statuses
// @route   GET /api/faculty/class-statuses
// @access  Private/Faculty
const getClassStatuses = async (req, res) => {
  const statuses = await ClassStatus.find({ facultyName: req.user.username }).populate('student', 'username');
  res.json(statuses);
};

module.exports = {
  createAssignment,
  assignMark,
  addNotice,
  getClassStatuses,
};
