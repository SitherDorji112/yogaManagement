const db = require('../config/db');

async function ensureBookingsTable() {
  try {
    await db.none(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        class_id INTEGER NOT NULL REFERENCES yoga_classes(id) ON DELETE CASCADE,
        booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ bookings table ensured.');
  } catch (error) {
    console.error('Error ensuring bookings table:', error);
  }
}

// Other booking-related DB functions can go here

module.exports = {
  ensureBookingsTable,
  // ...other exports
};
