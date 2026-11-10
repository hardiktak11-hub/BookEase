
import User from "../models/user.model.js";
import VendorProfile from "../models/vendorprofile.model.js";
import Booking from "../models/booking.model.js";

export const getAdminDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalCustomers,
      totalVendors,
      pendingVendors,
      approvedVendors,
      totalBookings,
      pendingBookings,
      completedBookings,
      cancelledBookings,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "customer" }),
      VendorProfile.countDocuments(),
      VendorProfile.countDocuments({ status: "pending" }),
      VendorProfile.countDocuments({ status: "approved" }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: "pending" }),
      Booking.countDocuments({ status: "completed" }),
      Booking.countDocuments({ status: "cancelled" }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Admin dashboard data fetched successfully",
      stats: {
        totalUsers,
        totalCustomers,
        totalVendors,
        pendingVendors,
        approvedVendors,
        totalBookings,
        pendingBookings,
        completedBookings,
        cancelledBookings,
      },
    });
  } catch (error) {
    console.log("Admin Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin dashboard data",
    });
  }
};
