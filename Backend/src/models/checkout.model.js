import mongoose from "mongoose";

const checkoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryAddress",
    },
    paymentMethod: {
      type: String,
      enum: ["cashOnDelivery", "creditCard"],
      required: true,
    },
    totalBeforeDiscount: {
      type: Number,
      required: true,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Checkout = mongoose.model("Checkout", checkoutSchema);
export default Checkout;
