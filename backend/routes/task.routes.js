import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import { createTask, listTasks, updateTaskStatus, updateTask } from "../controllers/task.controller.js";

const r = express.Router();
r.post("/projects/:projectId/tasks", auth, createTask);
r.get("/projects/:projectId/tasks", auth, listTasks);
r.patch("/:taskId/status", auth, updateTaskStatus);
r.put("/:taskId", auth, updateTask);
export default r;
