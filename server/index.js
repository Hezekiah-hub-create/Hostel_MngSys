require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const bookingRoutes = require('./routes/bookings');
const userRoutes = require('./routes/users');
const diningRoutes = require('./routes/dining');
const guestRoutes = require('./routes/guests');
const cronRoutes = require('./routes/cron');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dining', diningRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/cron', cronRoutes);

// Root
app.get('/', (req, res) => res.send('HMS API Running'));

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hms-db';

// Conditional connection for local development
if (process.env.NODE_ENV !== 'production') {
  mongoose.connect(MONGO_URI)
    .then(() => {
      console.log('MongoDB Connected Locally');
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => console.log(err));
} else {
  // In production (Vercel), we connect once and reuse
  mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected (Production)'))
    .catch((err) => console.log('MongoDB Connection Error:', err));
}

module.exports = app;
