import mongoose from "mongoose";
import { IVendor } from "../__types__/vendor.types";

const vendorSchema = new mongoose.Schema<IVendor>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    storeName: {
      type: String,
      required: true,
      unique: true,
    },
    storeLogo: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    addressLineOne: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    addressLineTwo: {
      type: String,
      required: true,
    },
    idDocument: {
      type: String,
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
      index: true,
    },
    accountApproval: {
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Vendor = mongoose.model<IVendor>("Vendor", vendorSchema);

export default Vendor;
