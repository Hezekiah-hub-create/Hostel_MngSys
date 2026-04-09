const express = require('express');
const Guest = require('../models/Guest');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// GET all guests
router.get('/', protect, async (req, res) => {
  try {
    const guests = await Guest.find({});
    res.json(guests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new guest
router.post('/', protect, async (req, res) => {
  try {
    const guest = await Guest.create(req.body);
    res.status(201).json(guest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
