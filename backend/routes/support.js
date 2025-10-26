const express = require('express');
const { body, validationResult } = require('express-validator');
const SupportTicket = require('../models/SupportTicket');
const auth = require('../middleware/auth');

const router = express.Router();

// Create support ticket
router.post('/ticket', auth, [
  body('category').isIn(['academic', 'fees', 'technical', 'hostel', 'library', 'other']).withMessage('Valid category is required'),
  body('priority').isIn(['low', 'medium', 'high', 'urgent']).withMessage('Valid priority is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('description').notEmpty().withMessage('Description is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { category, priority, subject, description } = req.body;

    const ticket = new SupportTicket({
      ticketId: SupportTicket.generateTicketId(),
      studentId: req.user.studentId,
      category,
      priority,
      subject,
      description
    });

    await ticket.save();

    res.status(201).json({
      success: true,
      message: 'Support ticket created successfully',
      ticket
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's tickets
router.get('/tickets', auth, async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ studentId: req.user.studentId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      tickets
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific ticket
router.get('/ticket/:ticketId', auth, async (req, res) => {
  try {
    const ticket = await SupportTicket.findOne({
      ticketId: req.params.ticketId,
      studentId: req.user.studentId
    });

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json({
      success: true,
      ticket
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add response to ticket (for admin use)
router.post('/ticket/:ticketId/response', auth, [
  body('message').notEmpty().withMessage('Message is required')
], async (req, res) => {
  try {
    const { message } = req.body;

    const ticket = await SupportTicket.findOne({
      ticketId: req.params.ticketId
    });

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    ticket.responses.push({
      message,
      respondedBy: req.user.studentId,
      respondedAt: new Date()
    });

    await ticket.save();

    res.json({
      success: true,
      message: 'Response added successfully',
      ticket
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update ticket status
router.put('/ticket/:ticketId/status', auth, [
  body('status').isIn(['open', 'in-progress', 'resolved', 'closed']).withMessage('Valid status is required')
], async (req, res) => {
  try {
    const { status } = req.body;

    const ticket = await SupportTicket.findOneAndUpdate(
      { ticketId: req.params.ticketId, studentId: req.user.studentId },
      { status },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json({
      success: true,
      message: 'Ticket status updated',
      ticket
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;