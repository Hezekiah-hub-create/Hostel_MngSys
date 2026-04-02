const mongoose = require('mongoose');

const tableReservationSchema = new mongoose.Schema({
  table: { type: mongoose.Schema.Types.ObjectId, ref: 'DiningTable', required: true },
  guest: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true }, // e.g. "19:00", "20:30"
  partySize: { type: Number, required: true },
  specialRequests: { type: String },
  status: { type: String, enum: ['Confirmed', 'Cancelled', 'Completed'], default: 'Confirmed' }
}, { timestamps: true });

module.exports = mongoose.model('TableReservation', tableReservationSchema);
