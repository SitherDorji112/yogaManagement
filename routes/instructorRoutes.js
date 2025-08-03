const express = require('express');
const router = express.Router();
const instructorController = require('../controllers/instructorController');

const ensureInstructor = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'instructor') {
    return next();
  }
  return res.status(403).send('Access Denied');
};

router.get('/dashboard', ensureInstructor, instructorController.getInstructorDashboard);
router.get('/classes', ensureInstructor, instructorController.getInstructorClasses);

// Add this route for /manage-classes
router.get('/manage-classes', ensureInstructor, instructorController.getManageClasses);

module.exports = router;
