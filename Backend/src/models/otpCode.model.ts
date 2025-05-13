import mongoose from "mongoose";
import { IOtpCode } from "../__types__/otpCode.types";

const otpSchema = new mongoose.Schema<IOtpCode>(
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

const OTP = mongoose.model<IOtpCode>("OTP", otpSchema);

export default OTP;
