const db = require('../config/db');

exports.getInstructorClasses = async (instructorId) => {
  return db.any('SELECT * FROM yoga_classes WHERE instructor_id = $1 ORDER BY schedule DESC', [instructorId]);
};

exports.addClass = async (instructorId, title, description, schedule) => {
  return db.none('INSERT INTO yoga_classes (title, description, instructor_id, schedule) VALUES ($1, $2, $3, $4)', [title, description, instructorId, schedule]);
};

exports.getClassesByInstructorId = async (instructorId) => {
  return await db.any(
    `SELECT * FROM yoga_classes WHERE instructor_id = $1 ORDER BY schedule DESC`,
    [instructorId]
  );
};


exports.getInstructorStats = async (instructorId) => {
  try {
    const totalClassesResult = await db.oneOrNone(
      'SELECT COUNT(*) AS count FROM yoga_classes WHERE instructor_id = $1',
      [instructorId]
    );

    const upcomingSessionsResult = await db.oneOrNone(
      `SELECT COUNT(*) AS count
       FROM yoga_classes
       WHERE instructor_id = $1 AND schedule > NOW()`,
      [instructorId]
    );

    // Assuming you have a 'bookings' table linking students to classes
    // and each booking links to a yoga_class which has instructor_id
    const totalStudentsResult = await db.oneOrNone(
      `SELECT COUNT(DISTINCT b.user_id) AS count
       FROM bookings b
       JOIN yoga_classes yc ON b.class_id = yc.id
       WHERE yc.instructor_id = $1`,
      [instructorId]
    );

    return {
      totalClasses: totalClassesResult ? +totalClassesResult.count : 0,
      upcomingSessions: upcomingSessionsResult ? +upcomingSessionsResult.count : 0,
      totalStudents: totalStudentsResult ? +totalStudentsResult.count : 0,
    };
  } catch (err) {
    console.error('Error fetching instructor stats:', err);
    return { totalClasses: 0, upcomingSessions: 0, totalStudents: 0 };
  }
};