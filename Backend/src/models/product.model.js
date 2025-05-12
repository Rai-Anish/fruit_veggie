import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    price: {
      type: Number,
      required: true,
    },
    costPrice: {
      type: Number,
      default: null,
    },
    isOrganic: {
      type: Boolean,
      default: false,
    },
    requestedOrganic: {
      type: Boolean,
      default: false,
    },
    organiceApproval: {
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: null,
      },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    imageUrl: [String],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
