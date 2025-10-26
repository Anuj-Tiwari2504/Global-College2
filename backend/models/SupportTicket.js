const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    required: true,
    unique: true
  },
  studentId: {
    type: String,
    required: true,
    ref: 'User'
  },
  category: {
    type: String,
    required: true,
    enum: ['academic', 'fees', 'technical', 'hostel', 'library', 'other']
  },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'urgent']
  },
  subject: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open'
  },
  assignedTo: {
    type: String,
    default: null
  },
  responses: [{
    message: String,
    respondedBy: String,
    respondedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Generate ticket ID
supportTicketSchema.statics.generateTicketId = function() {
  return 'TKT' + Date.now();
};

module.exports = mongoose.model('SupportTicket', supportTicketSchema);