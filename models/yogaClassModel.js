const db = require('../config/db');

const createYogaClassTable = async () => {
  try {
    await db.none(`
      CREATE TABLE IF NOT EXISTS yoga_classes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description TEXT,
        instructor_id INTEGER REFERENCES users(id),
        schedule TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ yoga_classes table ensured.');
  } catch (error) {
    console.error('❌ Error creating yoga_classes table:', error);
  }
};

module.exports = {
  createYogaClassTable,
};
