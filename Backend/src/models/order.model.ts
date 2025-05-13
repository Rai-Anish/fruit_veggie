import mongoose from "mongoose";

// Define the OrderItem schema as a sub-document within the Order schema
const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true, // Added index for filtering by product
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
); // _id: false means we don't need an additional ID for each item

// Define the main Order schema
const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    deliveryAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryAddress",
      required: true,
    },
    items: [orderItemSchema], // Embedding the orderItemSchema as an array
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
    },
    discountAmount: {
      type: Number,
      default: 0, // discount at order level
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["cashOnDelivery", "creditCard"],
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paitAt: {
      type: Date,
    },

    paymentStatus: {
      type: String,
      defualt: "pending",
      enum: ["pending", "completed"],
    },
    deliveryStatus: {
      type: String,
      enum: ["placed", "processing", "shipped", "delivered"],
      default: "placed",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

orderSchema.index({ customer: 1, status: 1, vendor: 1 });

export default Order;
