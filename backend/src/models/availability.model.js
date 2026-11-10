import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VendorProfile",
      required: true
    },

    dayOfWeek: {
      type: Number,
      required: true,
      min: 0,
      max: 6
    },

    startTime: {
      type: String,
      required: true
    },

    endTime: {
      type: String,
      required: true
    },

    slotDuration: {
      type: Number,
      required: true,
      min: 1
    },

    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// One weekly availability entry per vendor per day
availabilitySchema.index(
  { vendorId: 1, dayOfWeek: 1 },
  { unique: true }
);

const Availability = mongoose.model(
  "Availability",
  availabilitySchema
);

export default Availability;