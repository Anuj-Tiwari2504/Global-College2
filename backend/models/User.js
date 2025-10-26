const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true,
    enum: ['cse', 'mech', 'eee', 'civil', 'mba', 'science']
  },
  year: {
    type: Number,
    default: 1
  },
  dob: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  address: String,
  profilePhoto: {
    type: String,
    default: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate student ID
userSchema.statics.generateStudentId = async function() {
  let studentId;
  let exists = true;
  
  while (exists) {
    studentId = '11' + Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    exists = await this.findOne({ studentId });
  }
  
  return studentId;
};

module.exports = mongoose.model('User', userSchema);