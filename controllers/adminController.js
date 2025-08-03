const db = require('../config/db');
const adminModel = require('../models/adminModel');

exports.getAdminDashboard = async (req, res) => {
  try {
    const stats = await adminModel.getDashboardStats();
    const classes = await adminModel.getAllYogaClasses();

    // ✅ Get all instructors
    const instructors = await db.any('SELECT id, name FROM users WHERE role = $1', ['instructor']);

    res.render('admin/adminDashboard', {
      user: req.user,
      stats,
      classes,
      instructors, // pass to view
      message: req.flash('message')
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


exports.postAddClass = async (req, res) => {
  const { title, description, instructor_id, schedule } = req.body;

  try {
    const instructor = await db.oneOrNone(
      'SELECT * FROM users WHERE id = $1 AND role = $2',
      [instructor_id, 'instructor']
    );

    if (!instructor) {
      return res.status(400).send('Instructor not found or invalid.');
    }

    await db.none(
      `INSERT INTO yoga_classes (title, description, instructor_id, schedule)
       VALUES ($1, $2, $3, $4)`,
      [title, description, instructor_id, schedule]
    );

    if (req.flash) req.flash('message', 'Class added successfully.');
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('Error adding class:', err);
    res.status(500).send('Server Error');
  }
};

exports.postDeleteClass = async (req, res) => {
  const { id } = req.body;

  try {
    await db.none('DELETE FROM yoga_classes WHERE id = $1', [id]);

    if (req.flash) req.flash('message', 'Class deleted.');
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('Error deleting class:', err);
    res.status(500).send('Server Error');
  }
};
