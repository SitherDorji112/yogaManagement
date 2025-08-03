const jwt = require('jsonwebtoken');

exports.ensureAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];
    if (!token) return res.redirect('/login');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.redirect('/login');
  }
};

exports.ensureRole = (role) => {
  return (req, res, next) => {
    try {
      const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];
      if (!token) return res.redirect('/login');

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role === role) return next();

      res.status(403).send('Access Denied');
    } catch (error) {
      console.error('Role check error:', error);
      return res.redirect('/login');
    }
  };
};
