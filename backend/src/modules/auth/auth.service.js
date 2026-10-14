const db = require('../../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthService {
  async login(identifier, password, ipAddress, userAgent) {
    // Determine whether logging in with Email (Admin) or Access Code (Student, Instructor, Parent)
    let query;
    let values;

    if (identifier.includes('@')) {
      query = `SELECT * FROM ba_users WHERE email = $1 AND role = 'ADMIN' AND is_active = TRUE`;
      values = [identifier.toLowerCase()];
    } else {
      query = `SELECT * FROM ba_users WHERE access_code = $1 AND is_active = TRUE`;
      values = [identifier.toUpperCase()];
    }

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      throw { statusCode: 401, message: 'Invalid credentials or access code.' };
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      throw { statusCode: 401, message: 'Invalid credentials or password.' };
    }

    // Update last login
    await db.query(`UPDATE ba_users SET last_login = CURRENT_TIMESTAMP WHERE user_id = $1`, [user.user_id]);

    const payload = {
      userId: user.user_id,
      email: user.email,
      role: user.role,
      firstName: user.first_name,
      lastName: user.last_name,
      accessCode: user.access_code
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, { expiresIn: '7d' });

    // Store session
    const saltRounds = 10;
    const refreshTokenHash = await bcrypt.hash(refreshToken, saltRounds);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await db.query(
      `INSERT INTO ba_sessions (user_id, refresh_token_hash, ip_address, user_agent, expires_at) VALUES ($1, $2, $3, $4, $5)`,
      [user.user_id, refreshTokenHash, ipAddress, userAgent, expiresAt]
    );

    return {
      accessToken,
      refreshToken,
      user: {
        userId: user.user_id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
        accessCode: user.access_code
      }
    };
  }

  async getProfile(userId) {
    const query = `SELECT user_id, email, access_code, role, first_name, last_name, phone, last_login, created_at FROM ba_users WHERE user_id = $1`;
    const result = await db.query(query, [userId]);
    if (result.rows.length === 0) {
      throw { statusCode: 404, message: 'User not found.' };
    }
    return result.rows[0];
  }
}

module.exports = new AuthService();