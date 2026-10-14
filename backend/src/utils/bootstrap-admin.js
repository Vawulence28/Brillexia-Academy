const db = require('../config/db');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function bootstrapAdmin() {
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL || 'admin@brillexia.com';
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD || 'Admin123';
  const firstName = process.env.BOOTSTRAP_ADMIN_FIRST_NAME || 'Brillexia';
  const lastName = process.env.BOOTSTRAP_ADMIN_LAST_NAME || 'Admin';

  try {
    const check = await db.query('SELECT * FROM ba_users WHERE role = $1', ['ADMIN']);
    if (check.rows.length > 0) {
      console.log('Admin account already exists. Skipping bootstrap.');
      process.exit(0);
    }

    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    await db.query(
      `INSERT INTO ba_users (email, password_hash, role, first_name, last_name, is_active) VALUES ($1, $2, $3, $4, $5, TRUE)`,
      [email, passwordHash, 'ADMIN', firstName, lastName]
    );

    console.log(`SUCCESS: Initial Admin account created successfully for ${email}`);
    process.exit(0);
  } catch (err) {
    console.error('Error bootstrapping admin:', err);
    process.exit(1);
  }
}

bootstrapAdmin();