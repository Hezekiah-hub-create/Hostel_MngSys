const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   GET /api/rooms (Public)
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/rooms (Admin/Manager only)
router.post('/', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Server error', err: error.message });
  }
});

// @route   PUT /api/rooms/:id (Admin/Manager only)
router.put('/:id', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
