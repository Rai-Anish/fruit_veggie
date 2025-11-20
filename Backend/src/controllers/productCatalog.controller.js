import { ProductCatalog } from "../models/productCatalog.model.js";
import Category from "../models/category.model.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createProductCatalog = AsyncHandler(async (req, res) => {
  const { name, description, attributes, category } = req.body;

  if (!name || !attributes || !category) {
    throw new ApiError(400, "All fields are required");
  }

  const catalogExist = await ProductCatalog.findOne({ name });
  if (catalogExist) {
    throw new ApiError(409, "Product catalog already exists");
  }

  let parsedAttributes = attributes;
  if (typeof attributes === "string") {
    try {
      parsedAttributes = JSON.parse(attributes);
    } catch {
      throw new ApiError(400, "Invalid attributes JSON format");
    }
  }

  const categoryExist = await Category.findById(category);
  if (!categoryExist) {
    throw new ApiError(404, "Category not found");
  }

  const newCatalog = await ProductCatalog.create({
    name: name.toLowerCase(),
    description,
    attributes: parsedAttributes,
    category,
  });

  return res.status(201).json(
    new ApiResponse(201, "Product catalog created successfully", {
      id: newCatalog._id,
      name: newCatalog.name,
    })
  );
});

export const updateProductCatalog = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, attributes, category } = req.body;

  const catalog = await ProductCatalog.findById(id);
  if (!catalog) {
    throw new ApiError(404, "Product catalog not found");
  }

  // Check if new name conflicts with another catalog
  const nameConflict = await ProductCatalog.findOne({
    name: name.toLowerCase(),
    _id: { $ne: id }, // exclude current catalog
  });
  if (nameConflict) {
    throw new ApiError(
      409,
      "Another product catalog with this name already exists"
    );
  }

  let parsedAttributes = attributes;
  if (typeof attributes === "string") {
    try {
      parsedAttributes = JSON.parse(attributes);
    } catch {
      throw new ApiError(400, "Invalid attributes JSON format");
    }
  }

  const categoryExist = await Category.findById(category);
  if (!categoryExist) {
    throw new ApiError(404, "Category not found");
  }

  // Update fields
  catalog.name = name.toLowerCase();
  catalog.description = description;
  catalog.attributes = parsedAttributes;
  catalog.category = category;

  await catalog.save();

  return res.status(200).json(
    new ApiResponse(200, "Product catalog updated successfully", {
      id: catalog._id,
      name: catalog.name,
    })
  );
});

export const getAllCatalog = AsyncHandler(async (req, res) => {
  const catalogs = await ProductCatalog.find()
    .populate("category", "name")
    .sort({ createdAt: -1 });

  if (!catalogs) {
    throw new ApiError(404, "Catalogs list is empty");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Catalog fetched successfully", { catalogs }));
});

export const getCatalog = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const catalog = await ProductCatalog.findById(id);

  if (!catalog) {
    throw new ApiError(404, "Catalog not found");
  }

  res.status(200).json(new ApiResponse(200, "Catalog found", { catalog }));
});

export const deleteCatalog = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const catalog = await ProductCatalog.findById(id);

  if (!catalog) {
    throw new ApiError(404, "No catalog found");
  }

  await catalog.deleteOne();

  res
    .status(200)
    .json(
      new ApiResponse(200, "Catalog deleted successfully", { id: catalog._id })
    );
});
