const db = require('../config/db');

// Book a yoga class for a user
exports.bookClass = async (userId, classId) => {
  try {
    await db.none(
      'INSERT INTO bookings (user_id, class_id) VALUES ($1, $2)',
      [userId, classId]
    );
    return { success: true, message: 'Class booked successfully' };
  } catch (error) {
    console.error('Error booking class:', error);
    throw new Error('Could not book class');
  }
};

// Get all bookings for a specific user
exports.getUserBookings = async (userId) => {
  try {
    const bookings = await db.any(
      `SELECT b.id, c.title, c.schedule, u.name AS instructor_name 
       FROM bookings b
       JOIN yoga_classes c ON b.class_id = c.id
       JOIN users u ON c.instructor_id = u.id
       WHERE b.user_id = $1
       ORDER BY c.schedule DESC`,
      [userId]
    );
    return bookings;
  } catch (error) {
    console.error('Error retrieving user bookings:', error);
    throw new Error('Could not fetch bookings');
  }
};

// Get all bookings for an instructor's classes
exports.getInstructorBookings = async (instructorId) => {
  try {
    const bookings = await db.any(
      `SELECT b.id, u.name AS student_name, c.title, c.schedule
       FROM bookings b
       JOIN yoga_classes c ON b.class_id = c.id
       JOIN users u ON b.user_id = u.id
       WHERE c.instructor_id = $1
       ORDER BY c.schedule ASC`,
      [instructorId]
    );
    return bookings;
  } catch (error) {
    console.error('Error fetching instructor bookings:', error);
    throw new Error('Could not fetch instructor bookings');
  }
};

// ✅ NEW: Get stats for instructor dashboard
exports.getInstructorStats = async (instructorId) => {
  try {
    const stats = await db.one(`
  SELECT 
    (SELECT COUNT(*) FROM yoga_classes WHERE instructor_id = $1) AS total_classes,
    (SELECT COUNT(*) FROM yoga_classes WHERE instructor_id = $1 AND schedule > NOW()) AS upcoming_sessions,
    (SELECT COUNT(DISTINCT b.user_id)
     FROM bookings b
     JOIN yoga_classes yc ON b.class_id = yc.id
     WHERE yc.instructor_id = $1) AS total_students
`, [instructorId]);


    return stats;
  } catch (error) {
    console.error('Error fetching instructor stats:', error);
    throw new Error('Could not fetch instructor stats');
  }
};
