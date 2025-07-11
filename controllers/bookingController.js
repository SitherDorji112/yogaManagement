const bookingModel = require('../models/bookingModel');

// User books a class
exports.bookClass = async (req, res) => {
  const userId = req.session.user.id;
  const classId = req.body.classId || req.body.class_id;  // tolerate both

  try {
    await bookingModel.bookClass(userId, classId);
    res.redirect('/user/bookings');
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error booking class');
  }
};

// Show user bookings
exports.getUserBookings = async (req, res) => {
  const userId = req.session.user.id;

  try {
    const bookings = await bookingModel.getUserBookings(userId);
    res.render('user/bookClass', { 
      bookings,
      user: req.session.user,
      message: null  // or req.flash('message') if using flash middleware
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error loading bookings');
  }
};

// Show instructor's class bookings
exports.getInstructorBookings = async (req, res) => {
  const instructorId = req.session.user.id;

  try {
    const bookings = await bookingModel.getInstructorBookings(instructorId);
    res.render('instructor/manageClasses', { 
      bookings,
      user: req.session.user,
      message: null  // or flash message
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error loading instructor bookings');
  }
};
