import mongoose from "mongoose";
import { ICategory } from "../__types__/category.types";

const categorySchema = new mongoose.Schema<ICategory>(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    description: String,
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      index: true,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model<ICategory>("Category", categorySchema);

export default Category;
