import pool from "../config/db.js";
import { hashPassword } from "../utils/password.util.js";

export const addUser = async (req, res) => {
  try {
    const { tenantId } = req.params;   // ✅ CORRECT SOURCE
    const { email, password, fullName, role } = req.body;

    // 1️⃣ Only tenant_admin can add users
    if (req.user.role !== "tenant_admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden"
      });
    }

    // 2️⃣ Ensure tenant exists
    const tenant = await pool.query(
      "SELECT id FROM tenants WHERE id=$1",
      [tenantId]
    );

    if (!tenant.rowCount) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found"
      });
    }

    // 3️⃣ Prevent duplicate email in same tenant
    const exists = await pool.query(
      "SELECT id FROM users WHERE email=$1 AND tenant_id=$2",
      [email, tenantId]
    );

    if (exists.rowCount) {
      return res.status(409).json({
        success: false,
        message: "User already exists"
      });
    }

    // 4️⃣ Hash password
    const hashed = await hashPassword(password);

    // 5️⃣ Insert user with VALID tenant_id
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, full_name, role, tenant_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, full_name, role, tenant_id`,
      [email, hashed, fullName, role || "user", tenantId]
    );

    // 6️⃣ Success response
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: result.rows[0]
    });

  } catch (err) {
    console.error("Add user error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const listUsers = async (req, res) => {
  const users = await pool.query(
    "SELECT id,email,full_name,role FROM users WHERE tenant_id=$1",
    [req.params.tenantId]
  );
  res.json({ success: true, data: users.rows });
};

export const updateUser = async (req, res) => {
  await pool.query(
    "UPDATE users SET full_name=$1 WHERE id=$2",
    [req.body.fullName, req.params.userId]
  );
  res.json({ success: true });
};

export const deleteUser = async (req, res) => {
  await pool.query("DELETE FROM users WHERE id=$1", [req.params.userId]);
  res.json({ success: true });
};
