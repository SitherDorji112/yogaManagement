const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

router.get('/dashboard', ensureAuthenticated, userController.getDashboard);
router.get('/classes', ensureAuthenticated, userController.getAvailableClasses);

router.post('/book-class', ensureAuthenticated, userController.postBookClass);
router.post('/cancel-booking', ensureAuthenticated, userController.postCancelBooking);

module.exports = router;
