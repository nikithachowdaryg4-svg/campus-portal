const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', protect, admin, registerUser);

module.exports = router;
