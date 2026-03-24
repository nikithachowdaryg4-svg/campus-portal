const express = require('express');
const router = express.Router();
const { protect, faculty } = require('../middleware/authMiddleware');
const {
  createAssignment,
  assignMark,
  addNotice,
  getClassStatuses,
} = require('../controllers/facultyController');

router.post('/assignments', protect, faculty, createAssignment);
router.post('/marks', protect, faculty, assignMark);
router.post('/notices', protect, faculty, addNotice);
router.get('/class-statuses', protect, faculty, getClassStatuses);

module.exports = router;
