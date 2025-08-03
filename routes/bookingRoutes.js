const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Import named exports from middleware/authMiddleware.js
const { ensureAuthenticated, ensureRole } = require('../middleware/authMiddleware');

// User routes
router.post('/book', ensureAuthenticated, bookingController.bookClass);
router.get('/user/bookings', ensureAuthenticated, bookingController.getUserBookings);

// Instructor routes
router.get('/instructor/bookings', ensureAuthenticated, bookingController.getInstructorBookings);

module.exports = router;
