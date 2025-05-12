import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      enum: ["signUp", "login", "passwordReset"],
      required: true,
      default: "signUp",
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true, // Added index for filtering by expiration time
    },
  },
  { timestamps: true }
);

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;
