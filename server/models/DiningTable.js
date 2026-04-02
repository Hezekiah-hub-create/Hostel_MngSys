const mongoose = require('mongoose');

const diningTableSchema = new mongoose.Schema({
  tableNumber: { type: Number, required: true, unique: true },
  capacity: { type: Number, required: true }, // 2, 4, 6, 8
  location: { type: String, enum: ['Main Hall', 'Terrace', 'Private Room', 'Wine Cellar', 'Rooftop'], default: 'Main Hall' },
  status: { type: String, enum: ['Available', 'Reserved', 'Occupied'], default: 'Available' },
  imageUrl: { type: String },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('DiningTable', diningTableSchema);
