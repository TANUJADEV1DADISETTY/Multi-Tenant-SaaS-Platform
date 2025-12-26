import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import { createProject, listProjects, updateProject, deleteProject } from "../controllers/project.controller.js";

const r = express.Router();
r.post("/", auth, createProject);
r.get("/", auth, listProjects);
r.put("/:projectId", auth, updateProject);
r.delete("/:projectId", auth, deleteProject);
export default r;
