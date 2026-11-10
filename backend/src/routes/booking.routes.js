import express from "express";

import {
  createBooking,
  cancelBooking,
  getMyBookings,
  getVendorBookings,
  updateBookingStatus
} from "../controllers/booking.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";
import isApprovedVendor from "../middleware/vendor.middleware.js";

const router = express.Router();

// Customer creates booking
router.post(
  "/",
  verifyJWT,
  authorizeRoles("customer"),
  createBooking
);

// Customer booking history
router.get(
  "/my-bookings",
  verifyJWT,
  authorizeRoles("customer"),
  getMyBookings
);

// Customer cancels their booking
router.patch(
  "/:bookingId/cancel",
  verifyJWT,
  authorizeRoles("customer"),
  cancelBooking
);

// Vendor booking history
router.get(
  "/vendor-bookings",
  verifyJWT,
  authorizeRoles("vendor"),
  isApprovedVendor,
  getVendorBookings
);

// Vendor accepts, rejects, or completes a booking
router.patch(
  "/:bookingId/status",
  verifyJWT,
  authorizeRoles("vendor"),
  isApprovedVendor,
  updateBookingStatus
);
export default router;