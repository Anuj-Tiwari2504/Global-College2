const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Simple User Schema
const userSchema = new mongoose.Schema({
  studentId: { type: String, unique: true, required: true },
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  course: String,
  profilePhoto: { type: String, default: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Fee Payment Schema
const feeSchema = new mongoose.Schema({
  studentId: String,
  semester: Number,
  amount: Number,
  paymentMethod: String,
  transactionId: String,
  status: { type: String, default: 'completed' }
}, { timestamps: true });

const FeePayment = mongoose.model('FeePayment', feeSchema);

// Support Ticket Schema
const ticketSchema = new mongoose.Schema({
  ticketId: String,
  studentId: String,
  category: String,
  priority: String,
  subject: String,
  description: String,
  status: { type: String, default: 'open' }
}, { timestamps: true });

const SupportTicket = mongoose.model('SupportTicket', ticketSchema);

// Routes
app.get('/test', (req, res) => {
  res.json({ message: 'Server working!', timestamp: new Date() });
});

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, course } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Generate student ID
    const studentId = '11' + Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = new User({
      studentId,
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      course
    });
    
    await user.save();
    
    // Generate token
    const token = jwt.sign({ id: user._id }, 'secret_key', { expiresIn: '7d' });
    
    res.status(201).json({
      success: true,
      token,
      studentId,
      user: {
        id: user._id,
        studentId: user.studentId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        course: user.course
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { studentId, password } = req.body;
    
    // Find user
    const user = await User.findOne({ studentId });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign({ id: user._id }, 'secret_key', { expiresIn: '7d' });
    
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        studentId: user.studentId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        course: user.course,
        profilePhoto: user.profilePhoto
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Pay Fees
app.post('/api/fees/pay', async (req, res) => {
  try {
    const { studentId, semester, amount, paymentMethod } = req.body;
    
    const transactionId = 'TXN' + Date.now();
    
    const payment = new FeePayment({
      studentId,
      semester,
      amount,
      paymentMethod,
      transactionId
    });
    
    await payment.save();
    
    res.json({
      success: true,
      message: 'Payment successful',
      transactionId,
      payment
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create Support Ticket
app.post('/api/support/ticket', async (req, res) => {
  try {
    const { studentId, category, priority, subject, description } = req.body;
    
    const ticketId = 'TKT' + Date.now();
    
    const ticket = new SupportTicket({
      ticketId,
      studentId,
      category,
      priority,
      subject,
      description
    });
    
    await ticket.save();
    
    res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      ticketId,
      ticket
    });
  } catch (error) {
    console.error('Ticket error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all users (for testing)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all payments (for testing)
app.get('/api/payments', async (req, res) => {
  try {
    const payments = await FeePayment.find();
    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all tickets (for testing)
app.get('/api/tickets', async (req, res) => {
  try {
    const tickets = await SupportTicket.find();
    res.json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// MongoDB Connection and Server Start
mongoose.connect('mongodb://localhost:27017/global_institute')
.then(() => {
  console.log('✅ MongoDB Connected Successfully');
  
  const PORT = 3002;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Test API: http://localhost:${PORT}/test`);
    console.log(`👥 View Users: http://localhost:${PORT}/api/users`);
    console.log(`💳 View Payments: http://localhost:${PORT}/api/payments`);
    console.log(`🎫 View Tickets: http://localhost:${PORT}/api/tickets`);
  });
})
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err.message);
  process.exit(1);
});