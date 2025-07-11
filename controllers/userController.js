const userModel = require('../models/userModels');

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await userModel.getUserBookings(userId);
    res.render('user/userDashboard', { user: req.user, bookings, message: null });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.getAvailableClasses = async (req, res) => {
  try {
    const classes = await userModel.getAvailableClasses();
    res.render('user/classes', { user: req.user, classes, message: null });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.postBookClass = async (req, res) => {
  try {
    const userId = req.user.id;
    const classId = req.body.class_id;
    await userModel.addBooking(userId, classId);
    res.redirect('/user/dashboard');
  } catch (error) {
    const classes = await userModel.getAvailableClasses();
    res.render('user/classes', { user: req.user, classes, message: error.message });
  }
};

exports.postCancelBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookingId = req.body.booking_id;
    await userModel.cancelBooking(bookingId, userId);
    res.redirect('/user/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error canceling booking');
  }
};
