import express from "express";
import { registerTenant, login, me, logout } from "../controllers/auth.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const r = express.Router();
r.post("/register-tenant", registerTenant);
r.post("/login", login);
r.get("/me", auth, me);
r.post("/logout", auth, logout);
export default r;
