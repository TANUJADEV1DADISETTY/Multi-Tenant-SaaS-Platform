import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import { getTenant, updateTenant, listTenants } from "../controllers/tenant.controller.js";

const r = express.Router();
r.get("/", auth, listTenants);
r.get("/:tenantId", auth, getTenant);
r.put("/:tenantId", auth, updateTenant);
export default r;
