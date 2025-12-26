import "dotenv/config"; // MUST be first
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import app from "./app.js";
import pool from "./config/db.js";
import { initSuperAdmin } from "./utils/initSuperAdmin.js";

const PORT = process.env.PORT || 5000;

// ES module dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- RUN MIGRATIONS ----------
async function runMigrations() {
  const migrationsDir = path.join(__dirname, "migrations");

  const files = fs
    .readdirSync(migrationsDir)
    .filter(file => file.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, "utf8");

    console.log(`▶ Running migration: ${file}`);
    await pool.query(sql);
  }
}

// ---------- RUN SEEDS ----------
async function runSeeds() {
  const seedPath = path.join(__dirname, "seeds", "seed.sql");
  if (fs.existsSync(seedPath)) {
    const seedSQL = fs.readFileSync(seedPath, "utf8");
    await pool.query(seedSQL);
    console.log("▶ Seed data loaded");
  }
}

// ---------- START SERVER ----------
async function startServer() {
  try {
    await runMigrations();
    await runSeeds();
    await initSuperAdmin();

    app.listen(PORT, () => {
      console.log(`🚀 Backend running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Startup failed:", err);
    process.exit(1);
  }
}

startServer();
