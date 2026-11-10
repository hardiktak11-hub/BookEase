import VendorProfile from "../models/vendorprofile.model.js";
import { VENDOR_STATUS } from "../constants/vendorStatus.js";

// Approve Vendor
export const approveVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const vendor = await VendorProfile.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found"
      });
    }

    if (vendor.status === VENDOR_STATUS.SUSPENDED) {
      return res.status(400).json({
        success: false,
        message: "Suspended vendors cannot be approved directly"
      });
    }

    vendor.status = VENDOR_STATUS.APPROVED;
    await vendor.save();

    return res.status(200).json({
      success: true,
      message: "Vendor approved successfully",
      vendor
    });

  } catch (error) {
    console.error("Vendor approval error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

//Reject Vendor

export const rejectVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const vendor = await VendorProfile.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found"
      });
    }

    vendor.status = VENDOR_STATUS.REJECTED;
    await vendor.save();

    return res.status(200).json({
      success: true,
      message: "Vendor rejected successfully"
    });

  } catch (error) {
    console.error("Vendor rejection error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Suspend Vendor

export const suspendVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const vendor = await VendorProfile.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found"
      });
    }

    vendor.status = VENDOR_STATUS.SUSPENDED;
    await vendor.save();

    return res.status(200).json({
      success: true,
      message: "Vendor suspended successfully"
    });

  } catch (error) {
    console.error("Vendor suspension error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Get all vendors (Admin only)
export const getAllVendors = async (req, res) => {
  try {
    const vendors = await VendorProfile.find()
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: vendors.length,
      vendors
    });

  } catch (error) {
    console.error("Get vendors error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
