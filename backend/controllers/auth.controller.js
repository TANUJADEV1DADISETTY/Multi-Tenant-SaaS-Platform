import pool from "../config/db.js";
import { hashPassword, comparePassword } from "../utils/password.util.js";
import { generateToken } from "../utils/jwt.util.js";

// ================================
// REGISTER TENANT
// ================================
export const registerTenant = async (req, res) => {
  const { tenantName, subdomain, adminEmail, adminPassword } = req.body;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const tenant = await client.query(
      "INSERT INTO tenants(name, subdomain) VALUES($1,$2) RETURNING id",
      [tenantName, subdomain]
    );

    const pwd = await hashPassword(adminPassword);

    await client.query(
      `INSERT INTO users (email, password_hash, role, tenant_id)
       VALUES ($1, $2, 'tenant_admin', $3)`,
      [adminEmail, pwd, tenant.rows[0].id]
    );

    await client.query("COMMIT");

    return res.status(201).json({
      success: true,
      message: "Tenant registered successfully"
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    return res.status(400).json({ success: false });
  } finally {
    client.release();
  }
};

// ================================
// LOGIN
// ================================
export const login = async (req, res) => {
  const { email, password, tenantSubdomain } = req.body;

  // ---------- SUPER ADMIN LOGIN ----------
  if (!tenantSubdomain) {
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email=$1 AND role='super_admin'",
      [email]
    );

    if (!userResult.rowCount) {
      return res.status(401).json({
        success: false,
        message: "Invalid super admin credentials"
      });
    }

    const user = userResult.rows[0];

    const ok = await comparePassword(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({
        success: false,
        message: "Invalid super admin credentials"
      });
    }

    const token = generateToken({
      userId: user.id,
      tenantId: null,
      role: "super_admin"
    });

    return res.json({
      success: true,
      data: { token }
    });
  }

  // ---------- TENANT USER LOGIN ----------
  const tenantResult = await pool.query(
    "SELECT * FROM tenants WHERE subdomain=$1",
    [tenantSubdomain]
  );

  if (!tenantResult.rowCount) {
    return res.status(404).json({
      success: false,
      message: "Tenant not found"
    });
  }

  const tenant = tenantResult.rows[0];

  const userResult = await pool.query(
    "SELECT * FROM users WHERE email=$1 AND tenant_id=$2",
    [email, tenant.id]
  );

  if (!userResult.rowCount) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials"
    });
  }

  const user = userResult.rows[0];

  const ok = await comparePassword(password, user.password_hash);
  if (!ok) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials"
    });
  }

  const token = generateToken({
    userId: user.id,
    tenantId: tenant.id,
    role: user.role
  });

  return res.json({
    success: true,
    data: { token }
  });
};

// ================================
// ME
// ================================
export const me = async (req, res) => {
  return res.json({
    success: true,
    data: req.user
  });
};

// ================================
// LOGOUT
// ================================
export const logout = async (req, res) => {
  return res.json({
    success: true,
    message: "Logged out successfully"
  });
};
