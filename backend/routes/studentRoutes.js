const express = require('express');
const router = express.Router();
const { protect, student } = require('../middleware/authMiddleware');
const {
  getMarks,
  getAssignments,
  submitAssignment,
  getNotices,
  submitClassStatus,
  getFaculties
} = require('../controllers/studentController');

router.get('/marks', protect, student, getMarks);
router.get('/assignments', protect, student, getAssignments);
router.post('/assignments/:id/submit', protect, student, submitAssignment);
router.get('/notices', protect, student, getNotices);
router.post('/class-status', protect, student, submitClassStatus);
router.get('/faculties', protect, student, getFaculties);

module.exports = router;
