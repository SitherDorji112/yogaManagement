const jwt = require('jsonwebtoken');

const ensureInstructor = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.redirect('/login');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'instructor') return res.status(403).send('Access Denied');

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).send('Invalid Token');
  }
};

module.exports = ensureInstructor;
