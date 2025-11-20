import mongoose from "mongoose";

const productCatalogSchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    description: String,
    attributes: {
      type: new mongoose.Schema(
        {
          color: [String],
          type: [String],
          size: [String],
        },
        { _id: false }
      ),
      required: true,
    },
  },
  { timestamps: true }
);

const ProductCatalog = mongoose.model("ProductCatalog", productCatalogSchema);

export { ProductCatalog };
