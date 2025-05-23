import mongoose from "mongoose";

const pormoCodeSchema = mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
    },
    type: {
      type: String,
      enum: ["percentage", "fixed"],
    },
    value: Number,
    validFrom: Date,
    validTo: Date,
    maxUsage: Number,
    usedCount: {
      type: Number,
      default: 0,
    },
    isActive: Boolean,
  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", pormoCodeSchema);

export default Coupon;
