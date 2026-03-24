const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();

    const adminUser = {
      username: 'admin',
      password: 'password123',
      role: 'admin',
    };

    await User.create(adminUser);
    console.log('Admin user seeded (admin / password123)');

    const studentUser = {
      username: 'student1',
      password: 'password123',
      role: 'student',
    };

    await User.create(studentUser);
    console.log('Student user seeded (student1 / password123)');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
