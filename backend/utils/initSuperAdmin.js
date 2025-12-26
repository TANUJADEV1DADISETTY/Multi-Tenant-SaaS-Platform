import pool from "../config/db.js";
import { hashPassword } from "./password.util.js";

export const initSuperAdmin = async () => {
  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;
  const fullName = process.env.SUPER_ADMIN_NAME;

  if (!email || !password) {
    console.log("⚠️ Super admin env not set. Skipping.");
    return;
  }

  const existing = await pool.query(
    "SELECT id FROM users WHERE role='super_admin'"
  );

  if (existing.rowCount > 0) {
    console.log("✅ Super admin already exists");
    return;
  }

  const hashed = await hashPassword(password);

  await pool.query(
    `INSERT INTO users 
     (email, password_hash, full_name, role, tenant_id, is_active)
     VALUES ($1, $2, $3, 'super_admin', NULL, true)`,
    [email, hashed, fullName]
  );

  console.log("🚀 Super admin auto-created");
};
