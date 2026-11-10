import mongoose from "mongoose";
import { VENDOR_STATUS } from "../constants/vendorStatus.js";

const vendorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    businessName:{
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    serviceCategories: [
      {
        type: String,
        trim: true
      }
    ],

    experience: {
      type: Number,
      min: 0,
      default: 0
    },

    address: {
      street: String,
      city: String,
      state: String,
      pincode: String
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "suspended"],
      default: "pending"
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },

    totalReviews: {
      type: Number,
      default: 0,
      min: 0
    },

    status: {
  type: String,
  enum: Object.values(VENDOR_STATUS),
  default: VENDOR_STATUS.PENDING
}

  },
  {
    timestamps: true
  }
);

const VendorProfile = mongoose.model("VendorProfile",vendorProfileSchema);

export default VendorProfile;
