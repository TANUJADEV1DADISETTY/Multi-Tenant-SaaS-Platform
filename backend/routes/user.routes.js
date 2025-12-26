import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import { addUser, listUsers, updateUser, deleteUser } from "../controllers/user.controller.js";

const r = express.Router();
r.post("/tenants/:tenantId/users", auth, addUser);
r.get("/tenants/:tenantId/users", auth, listUsers);
r.put("/users/:userId", auth, updateUser);
r.delete("/users/:userId", auth, deleteUser);
export default r;
