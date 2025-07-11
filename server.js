const express = require('express');
const path = require('path');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const { createUserTable } = require('./models/userModel');
const { createYogaClassTable } = require('./models/yogaClassModel'); 
const attachUser = require('./middleware/attachUser');


const app = express();
const PORT = process.env.PORT || 3000;


//Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'secretkey',
  resave: false,
    saveUninitialized: true,
}));

app.use(flash());

//setting up view engine as ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Setting up static files directory
app.use(express.static(path.join(__dirname, 'public')));

//Route imports
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const bookingModel = require('./models/bookingModel');
const instructorRoutes = require('./routes/instructorRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

 
app.use('/admin', adminRoutes);
app.use('/', authRoutes);
app.use(attachUser); // Attach user to request object for all routes
app.use('/user', userRoutes);
app.use('/instructor', instructorRoutes);
app.use('/booking', bookingRoutes);

//create your schema
createUserTable()
createYogaClassTable();

//starting the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

async function startServer() {
  // Ensure tables
  await bookingModel.ensureBookingsTable();

  // Then start the server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
