const Event = require('../models/Event');

// @desc    Get all events
// @route   GET /api/events
// @access  Private
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('createdBy', 'username').populate('attendees', 'username').sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private/Admin or Faculty
const createEvent = async (req, res) => {
  try {
    const { title, description, date, location } = req.body;
    
    // Only Admin or Faculty can create events (handled by middleware, but extra check is fine)
    if (req.user.role === 'student') {
        return res.status(403).json({ message: 'Not authorized to create events' });
    }

    const event = await Event.create({
      title,
      description,
      date,
      location,
      createdBy: req.user._id,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle RSVP for an event
// @route   PUT /api/events/:id/rsvp
// @access  Private/Student
const toggleRsvp = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the user is already in the attendees array
    const isAttending = event.attendees.includes(req.user._id);

    if (isAttending) {
      // Remove them
      event.attendees = event.attendees.filter(
        (attendee) => attendee.toString() !== req.user._id.toString()
      );
    } else {
      // Add them
      event.attendees.push(req.user._id);
    }

    await event.save();
    
    const updatedEvent = await Event.findById(req.params.id).populate('createdBy', 'username').populate('attendees', 'username');
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getEvents, createEvent, toggleRsvp };
