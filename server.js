const express = require('express');
const path = require('path');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const attachUser = require('./middleware/attachUser');

// Models
const { createUserTable } = require('./models/userModel');
const { createYogaClassTable } = require('./models/yogaClassModel');
const { ensureBookingsTable } = require('./models/bookingModel');

// Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const instructorRoutes = require('./routes/instructorRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'secretkey',
  resave: false,
  saveUninitialized: true,
}));
app.use(flash());

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/admin', adminRoutes);
app.use('/', authRoutes);
app.use(attachUser); // Attach user info for views and access control
app.use('/user', userRoutes);
app.use('/instructor', instructorRoutes);
app.use('/booking', bookingRoutes);

// Start server after ensuring all tables exist
async function startServer() {
  try {
    await createUserTable();
    await createYogaClassTable();
    await ensureBookingsTable();

    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
  }
}

startServer();
