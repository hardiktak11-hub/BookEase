import express from "express";

import {verifyJWT} from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";

import {
  approveVendor,
  rejectVendor,
  suspendVendor,
  getAllVendors
} from "../controllers/vendor.controller.js";

const router = express.Router();

//get all vendor
router.get(
  "/",
  verifyJWT,
  authorizeRoles("admin"),
  getAllVendors
);

// Admin-only vendor management
router.patch(
  "/:vendorId/approve",
  verifyJWT,
  authorizeRoles("admin"),
  approveVendor
);

router.patch(
  "/:vendorId/reject",
  verifyJWT,
  authorizeRoles("admin"),
  rejectVendor
);

router.patch(
  "/:vendorId/suspend",
  verifyJWT,
  authorizeRoles("admin"),
  suspendVendor
);

export default router;
