const db = require('../config/db');

// Create users table if not exists
const createUserTable = async () => {
  try {
    await db.none(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(10) DEFAULT 'user', -- values: user, admin, instructor
        is_verified BOOLEAN DEFAULT false,
        verification_token TEXT,
        reset_token TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table ensured.');
  } catch (error) {
    console.error('❌ Error creating users table:', error);
  }
};

// Create a new user
const createUser = async ({ name, email, password, role = 'user', verification_token }) => {
  try {
    const result = await db.one(
      `INSERT INTO users (name, email, password, role, verification_token)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, email, password, role, verification_token]
    );
    return result;
  } catch (err) {
    throw err;
  }
};

// Get user by email
const getUserByEmail = async (email) => {
  return await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
};

// Get user by ID
const getUserById = async (id) => {
  return await db.oneOrNone('SELECT * FROM users WHERE id = $1', [id]);
};

// Update password or verification status
const updateUser = async (id, updates) => {
  const fields = [];
  const values = [id];
  let i = 2;

  for (const key in updates) {
    fields.push(`${key} = $${i}`);
    values.push(updates[key]);
    i++;
  }

  const query = `
    UPDATE users SET ${fields.join(', ')}
    WHERE id = $1 RETURNING *
  `;

  return await db.one(query, values);
};

// Get users by role (for admin panel)
const getUsersByRole = async (role) => {
  const result = await db.any('SELECT * FROM users WHERE role = $1', [role]);
  return result;
};

module.exports = {
  createUserTable,
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
  getUsersByRole
};
