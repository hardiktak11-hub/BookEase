import Booking from "../models/booking.model.js";
import Service from "../models/service.model.js";
import Availability from "../models/availability.model.js";
import VendorProfile from "../models/vendorprofile.model.js";

export const createBooking = async (req, res) => {
  try {
    const {
      serviceId,
      bookingDate,
      startTime
    } = req.body;

    // Find active service
    const service = await Service.findOne({
      _id: serviceId,
      isActive: true
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    // Find vendor profile
    const vendor = await VendorProfile.findById(service.vendorId);

    if (!vendor || vendor.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Vendor is not available"
      });
    }

    // Validate booking date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (
      !dateRegex.test(bookingDate) ||
      new Date(`${bookingDate}T00:00:00.000Z`).toISOString().slice(0, 10) !== bookingDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking date. Use YYYY-MM-DD"
      });
    }

    // Prevent booking in the past
    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata"
    });

    if (bookingDate < today) {
      return res.status(400).json({
        success: false,
        message: "Cannot book a past date"
      });
    }

    // Validate start time
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (!timeRegex.test(startTime)) {
      return res.status(400).json({
        success: false,
        message: "Invalid start time. Use HH:mm"
      });
    }

    // Calculate end time using service duration
    const [hours, minutes] = startTime.split(":").map(Number);

    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + service.duration;

    if (endMinutes > 24 * 60) {
      return res.status(400).json({
        success: false,
        message: "Service cannot extend beyond midnight"
      });
    }

    const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, "0")}:${String(endMinutes % 60).padStart(2, "0")}`;

    // Find vendor's availability for this weekday
   const date = new Date(`${bookingDate}T00:00:00.000Z`);
const dayOfWeek = date.getUTCDay();

console.log("Booking Date:", bookingDate);
console.log("Calculated Day:", dayOfWeek);
console.log("Service Vendor ID:", service.vendorId);

const availability = await Availability.findOne({
  vendorId: service.vendorId,
  dayOfWeek,
  isAvailable: true
});

console.log("Availability Found:", availability);

    if (!availability) {
      return res.status(400).json({
        success: false,
        message: "Vendor is not available on this day"
      });
    }

    // Check whether requested time is within working hours
    if (
      startTime < availability.startTime ||
      endTime > availability.endTime
    ) {
      return res.status(400).json({
        success: false,
        message: "Requested time is outside vendor working hours"
      });
    }

    // Check for overlapping bookings
    const conflictingBooking = await Booking.findOne({
      vendorId: service.vendorId,
      bookingDate,
      status: { $in: ["pending", "confirmed"] },
      startTime: { $lt: endTime },
      endTime: { $gt: startTime }
    });

    if (conflictingBooking) {
      return res.status(409).json({
        success: false,
        message: "This time slot is already booked"
      });
    }

    // Create booking
    const booking = await Booking.create({
      customerId: req.user._id,
      vendorId: service.vendorId,
      serviceId: service._id,
      bookingDate,
      startTime,
      endTime,
      totalPrice: service.price,
      status: "confirmed"
    });

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking
    });

  } catch (error) {
    console.error("Create booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findOne({
      _id: bookingId,
      customerId: req.user._id
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    if (!["pending", "confirmed"].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: "This booking cannot be cancelled"
      });
    }

    booking.status = "cancelled";

    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking
    });

  } catch (error) {
    console.error("Cancel booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
// Get logged-in customer's bookings
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      customerId: req.user._id
    })
      .populate("serviceId", "name category price")
      .populate("vendorId", "businessName")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });

  } catch (error) {
    console.error("Get customer bookings error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
// Get bookings assigned to logged-in vendor
export const getVendorBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      vendorId: req.vendorProfile._id
    })
      .populate("serviceId", "name category price")
      .populate("customerId", "username email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });

  } catch (error) {
    console.error("Get vendor bookings error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
// Update booking status by vendor
export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["confirmed", "cancelled", "completed"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status"
      });
    }

    // Find booking belonging to this vendor
    const booking = await Booking.findOne({
      _id: bookingId,
      vendorId: req.vendorProfile._id
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // Only pending bookings can be accepted or rejected
    if (
      booking.status !== "pending" &&
      ["confirmed", "cancelled"].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Only pending bookings can be accepted or rejected"
      });
    }

    // Only confirmed bookings can be completed
    if (status === "completed" && booking.status !== "confirmed") {
      return res.status(400).json({
        success: false,
        message: "Only confirmed bookings can be completed"
      });
    }

    booking.status = status;

    await booking.save();

    return res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
      booking
    });

  } catch (error) {
    console.error("Update booking status error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};