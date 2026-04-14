const Booking = require('../models/Booking');
const Room = require('../models/Room');
const TableReservation = require('../models/TableReservation');

/**
 * Updates status of bookings and dining reservations that have elapsed.
 */
const updateExpiredBookings = async () => {
  try {
    const now = new Date();
    const results = {
      bookingsUpdated: 0,
      roomsFreed: 0,
      diningUpdated: 0
    };

    // 1. Handle Room Bookings (Elapsed Stay)
    const elapsedBookings = await Booking.find({
      status: { $in: ['CheckedIn', 'Confirmed'] },
      checkOutDate: { $lte: now }
    });

    for (const booking of elapsedBookings) {
      // If they were checked in, mark as CheckedOut
      // If they were only confirmed (no-show/expired), mark as Cancelled
      if (booking.status === 'CheckedIn') {
        booking.status = 'CheckedOut';
      } else if (booking.status === 'Confirmed') {
        booking.status = 'Cancelled';
      }

      await booking.save();
      results.bookingsUpdated++;

      const room = await Room.findById(booking.room);
      if (room) {
        room.status = 'Available';
        await room.save();
        results.roomsFreed++;
      }
    }

    // 2. Handle Dining Reservations
    // Find 'Confirmed' dining reservations where date is today or earlier
    const possibleExpiredDining = await TableReservation.find({
      status: 'Confirmed',
      date: { $lte: now }
    });

    for (const resv of possibleExpiredDining) {
      // Combine date and time string to check if it's truly in the past
      const resvDateTime = new Date(resv.date);
      const [hours, minutes] = resv.time.split(':').map(Number);
      resvDateTime.setHours(hours, minutes, 0, 0);

      // We mark it completed if it's been more than 3 hours since the reservation time
      // or if the date is strictly before today.
      const threeHoursInMs = 3 * 60 * 60 * 1000;
      if (now.getTime() > (resvDateTime.getTime() + threeHoursInMs)) {
        resv.status = 'Completed';
        await resv.save();
        results.diningUpdated++;
      }
    }

    console.log(`[Cron] Updates completed: ${JSON.stringify(results)}`);
    return {
      message: 'Auto-update successful',
      ...results
    };
  } catch (error) {
    console.error('[Cron] Error in auto-update:', error);
    throw error;
  }
};

module.exports = { updateExpiredBookings };
