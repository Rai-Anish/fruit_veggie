import mongoose from "mongoose";

const deliveryAddressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Added index for filtering by user
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String },
    },
    isDefault: {
      type: Boolean,
      default: false,
      index: true, // Added index for filtering by default address
    },
  },
  { timestamps: true }
);

const DeliveryAddress = mongoose.model(
  "DeliveryAddress",
  deliveryAddressSchema
);

export default DeliveryAddress;
