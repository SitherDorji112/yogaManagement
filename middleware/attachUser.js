// middleware/attachUser.js
const jwt = require('jsonwebtoken');

const attachUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // decoded will have { id, email, role, etc. }
    next();
  } catch (err) {
    req.user = null;
    next();
  }
};

module.exports = attachUser;
