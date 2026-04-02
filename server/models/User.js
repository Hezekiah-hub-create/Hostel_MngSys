const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['client', 'receptionist', 'manager', 'admin'], 
    default: 'client' 
  },
  needsPasswordChange: { type: Boolean, default: false } // For walk-in clients
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
