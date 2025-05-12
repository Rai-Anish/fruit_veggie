import Category from "../models/category.model.js";
import ApiError from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import slugify from "slugify";

export const createCategory = AsyncHandler(async (req, res) => {
  const { name, description, parentCategory } = req.body;

  if (!name) {
    throw new ApiError(400, "Category name is required");
  }

  const normalizedName = name.trim().toLowerCase();

  // Check for existing category with lowercase name
  const categoryExist = await Category.findOne({ name: normalizedName });
  if (categoryExist) {
    throw new ApiError(400, "Category already exists");
  }

  // Generate initial slug
  let baseSlug = slugify(normalizedName, { lower: true, strict: true });
  let slug = baseSlug;
  let existing = await Category.findOne({ slug });

  // Ensure slug uniqueness
  let suffix = 1;
  while (existing) {
    slug = `${baseSlug}-${suffix}`;
    existing = await Category.findOne({ slug });
    suffix++;
  }

  const category = new Category({
    name: normalizedName,
    description: description || "",
    slug,
    parentCategory: parentCategory || null,
  });

  await category.save();

  res
    .status(200)
    .json(new ApiResponse(200, "Category created successfully", { category }));
});

export const updateCategory = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  let { name, description, parentCategory } = req.body;

  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  // Update name and regenerate slug if name is changing
  if (name) {
    const normalizedName = name.trim().toLowerCase();

    // Check for existing category with the new name (excluding current one)
    const existing = await Category.findOne({
      name: normalizedName,
      _id: { $ne: id },
    });
    if (existing) {
      throw new ApiError(
        400,
        "Another category with the same name already exists"
      );
    }

    category.name = normalizedName;

    // Regenerate slug with uniqueness check
    let baseSlug = slugify(normalizedName, { lower: true, strict: true });
    let slug = baseSlug;
    let suffix = 1;
    let existingSlug = await Category.findOne({ slug, _id: { $ne: id } });

    while (existingSlug) {
      slug = `${baseSlug}-${suffix}`;
      existingSlug = await Category.findOne({ slug, _id: { $ne: id } });
      suffix++;
    }

    category.slug = slug;
  }

  // Update description only if it's defined
  if (description !== undefined) {
    category.description = description.trim();
  }

  // Update parentCategory (allow null to remove it)
  if (parentCategory !== undefined) {
    category.parentCategory = parentCategory || null;
  }

  await category.save();

  res
    .status(200)
    .json(new ApiResponse(200, "Category updated successfully", { category }));
});

export const deleteCategory = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  await category.deleteOne();

  res.status(200).json(new ApiResponse(200, "Category deleted successfully"));
});

export const getCategory = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id).populate("parentCategory");

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Category fetched successfully", { category }));
});

export const getAllCategories = AsyncHandler(async (req, res) => {
  const categories = await Category.find()
    .populate("parentCategory", "name slug")
    .sort({ createdAt: -1 });

  res
    .status(200)
    .json(
      new ApiResponse(200, "Categories fetched successfully", { categories })
    );
});
