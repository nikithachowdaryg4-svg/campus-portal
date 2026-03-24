const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/faculty', require('./routes/facultyRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));

app.get('/', (req, res) => {
  res.send('Campus Portal API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
