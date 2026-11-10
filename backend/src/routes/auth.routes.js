import express from "express";

import {registerCustomer,registerVendor,loginUser,refreshAccessToken,logoutUser} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/register/customer", registerCustomer);
router.post("/register/vendor", registerVendor);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", logoutUser);

router.get("/me", verifyJWT, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Authenticated user",
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role
    }
  });
});

router.get(
  "/admin-only",
  verifyJWT,
  authorizeRoles("admin"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Admin"
    });
  }
);
export default router;