const { query } = require('../config/db');
const authService = require('../services/auth.service');

async function listRoles(req, res, next) {
  try {
    const rolesRes = await query(`
      SELECT r.*,
             COALESCE(
               (SELECT json_agg(json_build_object('id', p.id, 'name', p.name, 'resource', p.resource, 'action', p.action))
                FROM role_permissions rp JOIN permissions p ON rp.permission_id = p.id WHERE rp.role_id = r.id), '[]'::json
             ) as permissions
      FROM roles r
      ORDER BY r.created_at ASC
    `);
    res.json({ success: true, roles: rolesRes.rows });
  } catch (error) {
    next(error);
  }
}

async function listPermissions(req, res, next) {
  try {
    const resPerms = await query('SELECT * FROM permissions ORDER BY resource ASC, action ASC');
    res.json({ success: true, permissions: resPerms.rows });
  } catch (error) {
    next(error);
  }
}

async function createRole(req, res, next) {
  try {
    const { name, description, permission_ids = [] } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Role name is required' });

    const roleRes = await query(
      'INSERT INTO roles (name, description, is_system_role) VALUES ($1, $2, FALSE) RETURNING *',
      [name.trim(), description || '']
    );
    const role = roleRes.rows[0];

    for (const permId of permission_ids) {
      await query('INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [role.id, permId]);
    }

    res.status(201).json({ success: true, role });
  } catch (error) {
    next(error);
  }
}

async function listStaff(req, res, next) {
  try {
    const staff = await authService.listStaffUsers();
    res.json({ success: true, staff });
  } catch (error) {
    next(error);
  }
}

async function createStaff(req, res, next) {
  try {
    const { email, password, name, role_id } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: 'Email, password, and name are required' });
    }
    const user = await authService.createStaffUser({ email, password, name, role_id });
    res.status(201).json({ success: true, user });
  } catch (error) {
    next(error);
  }
}

async function updateStaff(req, res, next) {
  try {
    const { id } = req.params;
    const { name, role_id, is_active } = req.body;
    const user = await authService.updateStaffUser(id, { name, role_id, is_active });
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listRoles,
  listPermissions,
  createRole,
  listStaff,
  createStaff,
  updateStaff
};
