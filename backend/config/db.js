const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Server will continue without database connection. Please set MONGO_URI correctly.');
    // Do NOT call process.exit(1) - let the server stay alive so Render detects the port
  }
};

module.exports = connectDB;
