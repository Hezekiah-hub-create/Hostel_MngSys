const express = require('express');
const router = express.Router();
const { updateExpiredBookings } = require('../utils/cronJobs');

// Endpoint for Vercel Cron or manual trigger
router.get('/auto-checkout', async (req, res) => {
  // Simple protection for production
  const secret = req.query.secret || req.headers['x-cron-secret'];
  if (process.env.NODE_ENV === 'production' && secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const result = await updateExpiredBookings();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Auto-checkout failed', error: error.message });
  }
});

module.exports = router;
