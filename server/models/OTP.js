const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    otp: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      enum: ["account_verification", "event_booking"],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300, // OTP expires in 5 minutes (300 seconds)
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("OTP", otpSchema);
