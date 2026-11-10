import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";
import { getAdminDashboard } from "../controllers/admin.controller.js";

const router = express.Router();

router.get(
  "/dashboard",
  verifyJWT,
  authorizeRoles("admin"),
  getAdminDashboard
);

export default router;
