import VendorProfile from "../models/vendorprofile.model.js";
import { VENDOR_STATUS } from "../constants/vendorStatus.js";

const isApprovedVendor = async (req, res, next) => {
  try {
    // Check whether the logged-in user has a vendor profile
    const vendorProfile = await VendorProfile.findOne({
      userId: req.user._id
    });

    if (!vendorProfile) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found"
      });
    }

    // Check vendor approval status
    if (vendorProfile.status === VENDOR_STATUS.PENDING) {
      return res.status(403).json({
        success: false,
        message: "Your vendor application is pending approval"
      });
    }

    if (vendorProfile.status === VENDOR_STATUS.REJECTED) {
      return res.status(403).json({
        success: false,
        message: "Your vendor application has been rejected"
      });
    }

    if (vendorProfile.status === VENDOR_STATUS.SUSPENDED) {
      return res.status(403).json({
        success: false,
        message: "Your vendor account has been suspended"
      });
    }

    // Vendor is approved
    req.vendorProfile = vendorProfile;

    next();

  } catch (error) {
    console.error("Vendor middleware error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export default isApprovedVendor;