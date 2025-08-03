const db = require('../config/db');

const getUserBookings = async (userId) => {
  return await db.any(`
    SELECT b.id, c.title, c.description, u.name as instructor_name, c.schedule 
    FROM bookings b
    JOIN yoga_classes c ON b.class_id = c.id
    JOIN users u ON c.instructor_id = u.id
    WHERE b.user_id = $1
    ORDER BY c.schedule DESC
  `, [userId]);
};

const getAvailableClasses = async () => {
  return await db.any(`
    SELECT c.id, c.title, c.description, u.name as instructor_name, c.schedule
    FROM yoga_classes c
    JOIN users u ON c.instructor_id = u.id
    WHERE c.schedule >= NOW()
    ORDER BY c.schedule ASC
  `);
};

const addBooking = async (userId, classId) => {
  const existing = await db.oneOrNone(
    'SELECT * FROM bookings WHERE user_id = $1 AND class_id = $2',
    [userId, classId]
  );
  if (existing) {
    throw new Error('You have already booked this class.');
  }
  return await db.none(
    'INSERT INTO bookings (user_id, class_id) VALUES ($1, $2)',
    [userId, classId]
  );
};

const cancelBooking = async (bookingId, userId) => {
  return await db.none(
    'DELETE FROM bookings WHERE id = $1 AND user_id = $2',
    [bookingId, userId]
  );
};

module.exports = {
  getUserBookings,
  getAvailableClasses,
  addBooking,
  cancelBooking,
};
