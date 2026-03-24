const User = require('../models/User');

// @desc    Register a new faculty or student
// @route   POST /api/admin/register
// @access  Private/Admin
const registerUser = async (req, res) => {
  const { username, password, role } = req.body;

  if (role === 'admin') {
    return res.status(400).json({ message: 'Cannot register an admin through this route' });
  }

  const userExists = await User.findOne({ username });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({
    username,
    password,
    role,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      role: user.role,
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

module.exports = { registerUser };
