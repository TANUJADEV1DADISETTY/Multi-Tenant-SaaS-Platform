import express from "express";
import cors from "cors";

// Routes
import authRoutes from "./routes/auth.routes.js";
import tenantRoutes from "./routes/tenant.routes.js";
import userRoutes from "./routes/user.routes.js";
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";
import healthRoutes from "./routes/health.routes.js";

const app = express();

// ---------- MIDDLEWARE ----------
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

// ---------- ROUTES ----------
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api", userRoutes);       // users routes use /tenants/:id/users & /users/:id
app.use("/api/projects", projectRoutes);
app.use("/api", taskRoutes);

// ---------- DEFAULT ----------
app.get("/", (req, res) => {
  res.json({ success: true, message: "API running" });
});

export default app;
