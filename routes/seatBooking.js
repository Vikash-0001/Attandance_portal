const express = require('express');
const auth = require('../middleware/authMiddleware');
const SeatBooking = require('../models/SeatBooking');
const router = express.Router();

// Book a Seat
router.post('/book', auth, async (req, res) => {
    const { seatNumber, date } = req.body;
    try {
        let seatBooking = await SeatBooking.findOne({ seatNumber, date });
        if (seatBooking && seatBooking.status === 'booked') {
            return res.status(400).json({ msg: 'Seat already booked' });
        }
        seatBooking = new SeatBooking({ seatNumber, bookedBy: req.user.id, date, status: 'booked' });
        await seatBooking.save();
        res.json(seatBooking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get Booked Seats
router.get('/', auth, async (req, res) => {
    try {
        const seatBookings = await SeatBooking.find({ bookedBy: req.user.id });
        res.json(seatBookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
