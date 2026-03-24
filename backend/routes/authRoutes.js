const express = require('express');
const router = express.Router();
const { authUser, resetPassword } = require('../controllers/authController');

router.post('/login', authUser);
router.post('/reset-password', resetPassword);

module.exports = router;
