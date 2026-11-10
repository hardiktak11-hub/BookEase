import express from "express";

import {
  setAvailability,
  getMyAvailability
} from "../controllers/availability.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";
import isApprovedVendor from "../middleware/vendor.middleware.js";

const router = express.Router();

// Set or update availability
router.put(
  "/",
  verifyJWT,
  authorizeRoles("vendor"),
  isApprovedVendor,
  setAvailability
);

// Get my availability
router.get(
  "/",
  verifyJWT,
  authorizeRoles("vendor"),
  isApprovedVendor,
  getMyAvailability
);

export default router;