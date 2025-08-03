const instructorModel = require('../models/instructorModel');

exports.getInstructorDashboard = async (req, res) => {
  try {
    const instructorId = req.session.user.id; // get instructor id from session
    const stats = await instructorModel.getInstructorStats(instructorId);

    const message = req.flash ? req.flash('message') : null;

    res.render('instructor/instructorDashboard', {
      user: req.session.user,
      stats,
      message
    });
  } catch (error) {
    console.error('Error rendering instructor dashboard:', error);
    res.status(500).send('Server error');
  }
};

exports.getManageClasses = async (req, res) => {
  try {
    const instructorId = req.session.user.id;  // Or however you store user id in session

    const classes = await instructorModel.getInstructorClasses(instructorId);

    // Pass classes and a message (null if none)
    res.render('instructor/manageClasses', {
      classes,
      message: null  // or any string you want to display as a message
    });
  } catch (error) {
    console.error('Error loading manage classes page:', error);
    res.render('instructor/manageClasses', {
      classes: [],
      message: 'Failed to load classes. Please try again later.'
    });
  }
};

exports.postAddClass = async (req, res) => {
  const { title, description, schedule } = req.body;
  try {
    await instructorModel.addClass(req.user.id, title, description, schedule);
    res.redirect('/instructor/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
exports.getInstructorClasses = async (req, res) => {
  try {
    const instructorId = req.session.user.id;
    const classes = await instructorModel.getClassesByInstructorId(instructorId);
    res.render('instructor/manageClasses', {
      user: req.session.user,
      classes,
      message: req.flash('message')
    });
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).send('Server Error');
  }
};