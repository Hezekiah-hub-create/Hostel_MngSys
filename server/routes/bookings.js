const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const { protect, authorize } = require('../middleware/authMiddleware');

// Client creates booking
router.post('/', protect, async (req, res) => {
  const { roomId, checkInDate, checkOutDate, totalPrice } = req.body;
  try {
    // Check if room available
    const room = await Room.findById(roomId);
    if (!room || room.status !== 'Available') {
      return res.status(400).json({ message: 'Room not available' });
    }

    const booking = await Booking.create({
      user: req.user.id,
      room: roomId,
      checkInDate,
      checkOutDate,
      totalPrice,
    });

    room.status = 'Booked';
    await room.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Client views own bookings, Rec/Man/Adm views all
router.get('/', protect, async (req, res) => {
  try {
    if (req.user.role === 'client') {
      const bookings = await Booking.find({ user: req.user.id }).populate('room');
      return res.json(bookings);
    } else {
      const bookings = await Booking.find().populate('user', 'name email').populate('room');
      return res.json(bookings);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Client updates own booking (duration/dates)
router.put('/:id', protect, async (req, res) => {
  const { checkInDate, checkOutDate, totalPrice } = req.body;
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Verify ownership
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized modification' });
    }

    // Only allow modification for upcoming/Confirmed bookings
    if (booking.status !== 'Confirmed') {
      return res.status(400).json({ message: 'Only confirmed upcoming stays can be modified' });
    }

    booking.checkInDate = checkInDate;
    booking.checkOutDate = checkOutDate;
    booking.totalPrice = totalPrice;
    
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking status (Receptionist / Admin)
router.put('/:id/status', protect, authorize('receptionist', 'admin'), async (req, res) => {
  const { status } = req.body;
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = status;
    await booking.save();

    // If checked out or cancelled, make room available
    if (status === 'CheckedOut' || status === 'Cancelled') {
      const room = await Room.findById(booking.room);
      if (room) {
        room.status = 'Available';
        await room.save();
      }
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
