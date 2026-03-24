const express = require('express');
const router = express.Router();
const { getEvents, createEvent, toggleRsvp } = require('../controllers/eventController');
const { protect, faculty } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getEvents)
  .post(protect, createEvent); // the controller manually checks if role is student, but we could use custom middleware

router.route('/:id/rsvp').put(protect, toggleRsvp);

module.exports = router;
