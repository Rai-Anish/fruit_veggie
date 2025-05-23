import mongoose from "mongoose";

const orderDeliveryAddressSnapshotSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryAddress",
      required: true,
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
    addressLine: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: mongoose.Schema.Types.ObjectId,
        productName: String,
        vendorId: mongoose.Schema.Types.ObjectId,
        storeName: String, // vendor store name
        quantity: Number,
        price: Number, // original price
        discount: {
          type: {
            type: String,
            enum: ["percentage", "fixed"],
          },
          value: Number,
          validUntil: Date,
        },
        finalPrice: Number, // price after discount
        lineTotal: Number, // quantity * finalPrice
        lineTotalBeforeDiscount: Number,
      },
    ],
    deliveryAddress: orderDeliveryAddressSnapshotSchema,

    subTotal: {
      type: Number, // before coupon and delivery fee applied
      required: true,
    },
    coupon: {
      code: String,
      type: {
        type: String,
        enum: ["percentage", "fixed"],
      },
      value: Number,
      discountedAmount: Number,
    },
    deliveryFee: {
      type: Number,
      required: true,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true, // subtotal - coupon + delivery fee
      default: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["cash-on-delivery", "credit-card"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paidAt: {
      type: Date,
    },
    deliveryStatus: {
      type: String,
      enum: [
        "placed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
      ],
      default: "placed",
    },
  },
  { timestamps: true }
);

orderSchema.index({ customer: 1, deliveryStatus: 1, "vendor._id": 1 });

const Order = mongoose.model("Order", orderSchema);

export default Order;
