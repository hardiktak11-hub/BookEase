import Availability from "../models/availability.model.js";

// Create or update availability for a weekday
export const setAvailability = async (req, res) => {
  try {
    const {
      dayOfWeek,
      startTime,
      endTime,
      slotDuration,
      isAvailable
    } = req.body;

    // Validate weekday
    if (
      !Number.isInteger(dayOfWeek) ||
      dayOfWeek < 0 ||
      dayOfWeek > 6
    ) {
      return res.status(400).json({
        success: false,
        message: "dayOfWeek must be between 0 and 6"
      });
    }

    // Validate time format: HH:mm
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (
      !timeRegex.test(startTime) ||
      !timeRegex.test(endTime)
    ) {
      return res.status(400).json({
        success: false,
        message: "Time must be in HH:mm format"
      });
    }

    // Ensure end time is after start time
    if (startTime >= endTime) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time"
      });
    }

    const availability = await Availability.findOneAndUpdate(
      {
        vendorId: req.vendorProfile._id,
        dayOfWeek
      },
      {
        $set: {
          startTime,
          endTime,
          slotDuration,
          isAvailable
        }
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    );

    return res.status(200).json({
      success: true,
      message: "Availability saved successfully",
      availability
    });

  } catch (error) {
    console.error("Set availability error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
// Get logged-in vendor's weekly availability
export const getMyAvailability = async (req, res) => {
  try {
    const availability = await Availability.find({
      vendorId: req.vendorProfile._id
    }).sort({ dayOfWeek: 1 });

    return res.status(200).json({
      success: true,
      count: availability.length,
      availability
    });

  } catch (error) {
    console.error("Get availability error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};