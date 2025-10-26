const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Simple test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Test user creation
app.post('/test-user', async (req, res) => {
  try {
    const User = require('./models/User');
    
    const testUser = new User({
      studentId: '1100001',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '9876543210',
      password: 'password123',
      course: 'cse'
    });

    await testUser.save();
    res.json({ success: true, message: 'Test user created', user: testUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/global_institute')
.then(() => {
  console.log('MongoDB Connected');
  
  const PORT = 3002;
  app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
    console.log(`Test URL: http://localhost:${PORT}/test`);
    console.log(`Create test user: POST http://localhost:${PORT}/test-user`);
  });
})
.catch(err => {
  console.log('MongoDB Error:', err);
  process.exit(1);
});