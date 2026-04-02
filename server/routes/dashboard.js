import express from 'express';
import Room from '../models/Room.js';
import Booking from '../models/Booking.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// GET dashboard statistics
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const totalRooms = await Room.countDocuments();
    const availableRooms = await Room.countDocuments({ status: 'Available' });
    const occupiedRooms = await Room.countDocuments({ status: 'Occupied' });

    // Today's bookings
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todaysBookings = await Booking.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    // Revenue tracking (simple sum of all bookings)
    const bookings = await Booking.find({});
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalCost, 0);

    // Occupancy Rate
    const occupancyRate = totalRooms === 0 ? 0 : Math.round((occupiedRooms / totalRooms) * 100);

    res.json({
      totalRooms,
      availableRooms,
      occupiedRooms,
      todaysBookings,
      totalRevenue,
      occupancyRate
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
