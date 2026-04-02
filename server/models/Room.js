const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  type: { type: String, required: true }, // e.g., Single, Double, Suite
  price: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Available', 'Booked', 'Unavailable'], 
    default: 'Available' 
  },
  amenities: [{ type: String }],
  imageUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
