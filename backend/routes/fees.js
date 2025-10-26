const express = require('express');
const { body, validationResult } = require('express-validator');
const FeePayment = require('../models/FeePayment');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Fee structure
const feeStructure = {
  'cse': { tuition: 45000, lab: 8000, library: 2000 },
  'mech': { tuition: 42000, lab: 10000, library: 2000 },
  'eee': { tuition: 40000, lab: 9000, library: 2000 },
  'civil': { tuition: 38000, lab: 7000, library: 2000 },
  'mba': { tuition: 60000, lab: 3000, library: 2000 },
  'science': { tuition: 25000, lab: 5000, library: 2000 }
};

// Get fee structure for user's course
router.get('/structure', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const fees = feeStructure[user.course] || feeStructure['cse'];
    const totalSemesters = user.course === 'mba' ? 4 : (user.course === 'science' ? 6 : 8);
    
    const feeData = [];
    for (let i = 1; i <= totalSemesters; i++) {
      const total = fees.tuition + fees.lab + fees.library;
      feeData.push({
        semester: i,
        tuition: fees.tuition,
        lab: fees.lab,
        library: fees.library,
        total: total
      });
    }

    res.json({
      success: true,
      feeStructure: feeData,
      course: user.course
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get payment history
router.get('/payments', auth, async (req, res) => {
  try {
    const payments = await FeePayment.find({ studentId: req.user.studentId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      payments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Process payment
router.post('/pay', auth, [
  body('semester').isInt({ min: 1, max: 8 }).withMessage('Valid semester is required'),
  body('amount').isFloat({ min: 1 }).withMessage('Valid amount is required'),
  body('paymentMethod').isIn(['upi', 'card', 'netbanking']).withMessage('Valid payment method is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { semester, amount, paymentMethod, paymentDetails } = req.body;

    // Check if payment already exists for this semester
    const existingPayment = await FeePayment.findOne({
      studentId: req.user.studentId,
      semester: semester
    });

    if (existingPayment) {
      return res.status(400).json({ message: 'Payment already made for this semester' });
    }

    // Generate transaction ID
    const transactionId = 'TXN' + Date.now() + Math.floor(Math.random() * 1000);

    // Create payment record
    const payment = new FeePayment({
      studentId: req.user.studentId,
      semester,
      amount,
      paymentMethod,
      transactionId,
      paymentDetails: {
        upiId: paymentDetails?.upiId,
        cardLast4: paymentDetails?.cardNumber?.slice(-4),
        bankName: paymentDetails?.bankName
      }
    });

    await payment.save();

    res.json({
      success: true,
      message: 'Payment processed successfully',
      transactionId,
      payment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get payment status for all semesters
router.get('/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const payments = await FeePayment.find({ studentId: user.studentId });
    const totalSemesters = user.course === 'mba' ? 4 : (user.course === 'science' ? 6 : 8);
    
    const status = [];
    for (let i = 1; i <= totalSemesters; i++) {
      const payment = payments.find(p => p.semester === i);
      status.push({
        semester: i,
        paid: !!payment,
        paymentDate: payment?.createdAt,
        transactionId: payment?.transactionId,
        amount: payment?.amount
      });
    }

    res.json({
      success: true,
      status
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;