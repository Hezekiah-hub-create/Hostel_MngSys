const mongoose = require('mongoose');

const GuestSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  idPassport: { type: String, required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Guest', GuestSchema);
