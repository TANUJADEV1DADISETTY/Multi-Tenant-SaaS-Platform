import express from "express";
import pool from "../config/db.js";

const r = express.Router();
r.get("/", async (_, res) => {
  await pool.query("SELECT 1");
  res.json({ status: "ok", database: "connected" });
});
export default r;
