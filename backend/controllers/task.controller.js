import pool from "../config/db.js";

export const createTask = async (req, res) => {
  const t = await pool.query(
    "INSERT INTO tasks(title,project_id,tenant_id) VALUES($1,$2,$3) RETURNING *",
    [req.body.title, req.params.projectId, req.user.tenantId]
  );
  res.status(201).json({ success: true, data: t.rows[0] });
};

export const listTasks = async (req, res) => {
  const t = await pool.query(
    "SELECT * FROM tasks WHERE project_id=$1",
    [req.params.projectId]
  );
  res.json({ success: true, data: t.rows });
};

export const updateTaskStatus = async (req, res) => {
  await pool.query(
    "UPDATE tasks SET status=$1 WHERE id=$2",
    [req.body.status, req.params.taskId]
  );
  res.json({ success: true });
};

export const updateTask = async (req, res) => {
  await pool.query(
    "UPDATE tasks SET title=$1 WHERE id=$2",
    [req.body.title, req.params.taskId]
  );
  res.json({ success: true });
};
