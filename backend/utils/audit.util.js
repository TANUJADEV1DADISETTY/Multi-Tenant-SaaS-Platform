import { pool } from "../config/db.js";

export const logAudit = async (tenantId, userId, action) => {
  await pool.query(
    "INSERT INTO audit_logs (tenant_id, user_id, action) VALUES ($1,$2,$3)",
    [tenantId, userId, action]
  );
};
