const adminModel = require('../models/adminModel');

// exports.getAdminDashboard = async (req, res) => {
//   try {
//     const stats = await adminModel.getDashboardStats();
//     res.render('adminDashboard', {
//       user: req.session.user,
//       stats
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// };

const db = require('../config/db');


const getDashboardStats = async () => {
  const totalUsers = await db.one('SELECT COUNT(*) FROM users', [], a => +a.count);
  const totalInstructors = await db.one("SELECT COUNT(*) FROM users WHERE role = 'instructor'", [], a => +a.count);
  const totalClasses = await db.one('SELECT COUNT(*) FROM yoga_classes', [], a => +a.count);

  return { totalUsers, totalInstructors, totalClasses };
};

const getAllYogaClasses = async () => {
  return await db.any(`
    SELECT yc.*, u.name AS instructor_name 
    FROM yoga_classes yc
    LEFT JOIN users u ON yc.instructor_id = u.id
    ORDER BY yc.schedule DESC
  `);
};

const addYogaClass = async ({ title, description, instructor_id, schedule }) => {
  return await db.none(
    'INSERT INTO yoga_classes (title, description, instructor_id, schedule) VALUES ($1, $2, $3, $4)',
    [title, description, instructor_id, schedule]
  );
};

const deleteYogaClass = async (id) => {
  return await db.none('DELETE FROM yoga_classes WHERE id = $1', [id]);
};

const ensureAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    next();
  } else {
    res.status(403).send('Access Denied');
  }
};

module.exports = {
  getDashboardStats,
  getAllYogaClasses,
  addYogaClass,
  deleteYogaClass
};
