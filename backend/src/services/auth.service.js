const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');
const env = require('../config/env');
const logger = require('../utils/logger');

/**
 * Authenticate admin user by email and password
 */
async function loginAdmin(email, password) {
  const result = await query(
    `SELECT u.id, u.email, u.password_hash, u.name, u.is_active, r.id as role_id, r.name as role_name
     FROM admin_users u
     LEFT JOIN roles r ON u.role_id = r.id
     WHERE LOWER(u.email) = LOWER($1)`,
    [email]
  );

  if (result.rowCount === 0) {
    throw new Error('Invalid email or password');
  }

  const user = result.rows[0];

  if (!user.is_active) {
    throw new Error('This account has been deactivated. Please contact the administrator.');
  }

  const passwordMatch = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatch) {
    throw new Error('Invalid email or password');
  }

  // Update last login timestamp
  await query('UPDATE admin_users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

  // Fetch permissions
  const permResult = await query(
    `SELECT p.name
     FROM role_permissions rp
     JOIN permissions p ON rp.permission_id = p.id
     WHERE rp.role_id = $1`,
    [user.role_id]
  );

  const permissions = permResult.rows.map((row) => row.name);

  // Generate JWT token
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role_name
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );

  logger.info('Admin user logged in successfully', { email: user.email, role: user.role_name });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role_name,
      permissions
    }
  };
}

/**
 * Change admin password
 */
async function changePassword(userId, currentPassword, newPassword) {
  const res = await query('SELECT password_hash FROM admin_users WHERE id = $1', [userId]);
  if (res.rowCount === 0) {
    throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(currentPassword, res.rows[0].password_hash);
  if (!isMatch) {
    throw new Error('Current password does not match');
  }

  const hashedNew = await bcrypt.hash(newPassword, env.SALT_ROUNDS);
  await query('UPDATE admin_users SET password_hash = $1 WHERE id = $2', [hashedNew, userId]);

  return { success: true, message: 'Password updated successfully' };
}

/**
 * List all admin staff accounts with roles
 */
async function listStaffUsers() {
  const res = await query(
    `SELECT u.id, u.email, u.name, u.is_active, u.last_login_at, u.created_at, r.id as role_id, r.name as role_name
     FROM admin_users u
     LEFT JOIN roles r ON u.role_id = r.id
     ORDER BY u.created_at ASC`
  );
  return res.rows;
}

/**
 * Create a new admin user
 */
async function createStaffUser({ email, password, name, role_id }) {
  const passwordHash = await bcrypt.hash(password, env.SALT_ROUNDS);
  const res = await query(
    `INSERT INTO admin_users (email, password_hash, name, role_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, name, role_id, is_active, created_at`,
    [email.toLowerCase().trim(), passwordHash, name, role_id]
  );
  return res.rows[0];
}

/**
 * Update staff user status or role
 */
async function updateStaffUser(userId, { name, role_id, is_active }) {
  const res = await query(
    `UPDATE admin_users
     SET name = COALESCE($1, name),
         role_id = COALESCE($2, role_id),
         is_active = COALESCE($3, is_active)
     WHERE id = $4
     RETURNING id, email, name, role_id, is_active, updated_at`,
    [name, role_id, is_active, userId]
  );
  if (res.rowCount === 0) throw new Error('Staff user not found');
  return res.rows[0];
}

module.exports = {
  loginAdmin,
  changePassword,
  listStaffUsers,
  createStaffUser,
  updateStaffUser
};
