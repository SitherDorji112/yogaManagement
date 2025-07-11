const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// middleware/ensureAdmin.js
const ensureAdmin = (req, res, next) => {
  try {
    // ✅ Check that the session exists and the user has the admin role
    if (req.session?.user?.role === 'admin') {
      return next();            // Allow request to continue
    }

    // User is logged in but not an admin
    return res.status(403).send('Access Denied');
  } catch (err) {
    // Something went wrong (e.g., session store error)
    console.error('ensureAdmin error:', err);
    return res.status(500).send('Server Error');
  }
};

module.exports = ensureAdmin;


router.get('/dashboard', ensureAdmin, adminController.getAdminDashboard);
router.post('/add-class', ensureAdmin, adminController.postAddClass);
router.post('/delete-class', ensureAdmin, adminController.postDeleteClass);


module.exports = router;
