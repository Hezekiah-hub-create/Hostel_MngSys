const express = require('express');
const router = express.Router();
const DiningTable = require('../models/DiningTable');
const TableReservation = require('../models/TableReservation');
const { protect, authorize } = require('../middleware/authMiddleware');

// GET all dining tables (public)
router.get('/', async (req, res) => {
  try {
    const tables = await DiningTable.find().sort({ tableNumber: 1 });
    res.json(tables);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST reserve a table (authenticated)
router.post('/reserve', protect, async (req, res) => {
  try {
    const { tableId, date, time, partySize, specialRequests } = req.body;
    
    const table = await DiningTable.findById(tableId);
    if (!table) return res.status(404).json({ message: 'Table not found' });

    // Check if table is already reserved for the same date + time
    const existingReservation = await TableReservation.findOne({
      table: tableId,
      date: new Date(date).toISOString().split('T')[0],
      time: time,
      status: 'Confirmed'
    });

    if (existingReservation) {
      return res.status(400).json({ message: 'This table is already reserved for that date and time.' });
    }

    if (partySize > table.capacity) {
      return res.status(400).json({ message: `This table seats ${table.capacity}. Please choose a larger table.` });
    }

    const reservation = await TableReservation.create({
      table: tableId,
      guest: req.user.id,
      date: new Date(date),
      time,
      partySize,
      specialRequests
    });

    const populated = await TableReservation.findById(reservation._id).populate('table');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET my reservations (authenticated)
router.get('/my-reservations', protect, async (req, res) => {
  try {
    const reservations = await TableReservation.find({ guest: req.user.id })
      .populate('table')
      .sort({ date: -1 });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE cancel a reservation
router.delete('/reserve/:id', protect, async (req, res) => {
  try {
    const reservation = await TableReservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
    if (reservation.guest.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    reservation.status = 'Cancelled';
    await reservation.save();
    res.json({ message: 'Reservation cancelled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// STAFF: GET all dining reservations (manager/admin only)
router.get('/reservations', protect, authorize('manager', 'admin'), async (req, res) => {
  try {
    const reservations = await TableReservation.find()
      .populate('table')
      .populate('guest', 'name email')
      .sort({ date: -1 });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// STAFF: UPDATE reservation status (manager/admin only)
router.put('/reservations/:id/status', protect, authorize('manager', 'admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const reservation = await TableReservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });

    reservation.status = status;
    await reservation.save();

    const updated = await TableReservation.findById(req.params.id)
      .populate('table')
      .populate('guest', 'name email');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
