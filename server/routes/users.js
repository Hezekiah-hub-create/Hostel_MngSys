const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { protect, authorize } = require('../middleware/authMiddleware');

// Get users (Admin/Manager get all, Receptionist gets only clients)
router.get('/', protect, authorize('admin', 'manager', 'receptionist'), async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'receptionist') {
      query = { role: 'client' };
    }
    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Receptionist registering a walk-in client
router.post('/walk-in', protect, authorize('receptionist', 'admin'), async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'client',
      needsPasswordChange: true // Forces they reset next login
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
