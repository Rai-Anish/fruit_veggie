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
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    discount: {
      type: {
        type: String,
        enum: ["percentage", "fixed"],
      },
      value: Number,
      validUntil: Date,
    },
    attributes: {
      color: { type: String },
      type: { type: String },
      size: { type: String },
    },
    productCatalog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductCatalog",
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
    stock: {
      type: Number,
      default: 0,
    },

    images: [String],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
