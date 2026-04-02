import mongoose from 'mongoose';

const GuestSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  idPassport: { type: String, required: true, unique: true }
}, { timestamps: true });

export default mongoose.model('Guest', GuestSchema);
