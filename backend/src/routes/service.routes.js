import express from "express";

import { createService,getAllServices,getServiceById,updateService,deleteService } from "../controllers/service.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";
import isApprovedVendor from "../middleware/vendor.middleware.js";

const router = express.Router();

// Create service
router.post(
  "/",
  verifyJWT,
  authorizeRoles("vendor"),
  isApprovedVendor,
  createService
);
// Get all services
router.get("/", getAllServices);

// Get service by ID
router.get("/:serviceId", getServiceById);

// Update service
router.patch(
  "/:serviceId",
  verifyJWT,
  authorizeRoles("vendor"),
  isApprovedVendor,
  updateService
);

// Delete service
router.delete(
  "/:serviceId",
  verifyJWT,
  authorizeRoles("vendor"),
  isApprovedVendor,
  deleteService
);

export default router;