import pool from "../config/db.js";

export const createProject = async (req, res) => {
  const p = await pool.query(
    "INSERT INTO projects(name,tenant_id,created_by) VALUES($1,$2,$3) RETURNING *",
    [req.body.name, req.user.tenantId, req.user.userId]
  );
  res.status(201).json({ success: true, data: p.rows[0] });
};

export const listProjects = async (req, res) => {
  const p = await pool.query(
    "SELECT * FROM projects WHERE tenant_id=$1",
    [req.user.tenantId]
  );
  res.json({ success: true, data: p.rows });
};

export const updateProject = async (req, res) => {
  await pool.query(
    "UPDATE projects SET name=$1 WHERE id=$2",
    [req.body.name, req.params.projectId]
  );
  res.json({ success: true });
};

export const deleteProject = async (req, res) => {
  await pool.query("DELETE FROM projects WHERE id=$1", [req.params.projectId]);
  res.json({ success: true });
};
