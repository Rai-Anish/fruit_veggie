import Product from "../models/product.model.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Category from "../models/category.model.js";
import { ProductCatalog } from "../models/productCatalog.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"; // import Cloudinary helper

export const createProduct = AsyncHandler(async (req, res) => {
  // Get uploaded files
  const files = req.files;
  const id = req.user?._id;

  // Extract product data from request body
  const {
    name,
    price,
    description,
    costPrice,
    requestedOrganic,
    discount,
    category,
    attributes,
    productCatalog,
    stock = 0,
  } = req.body;

  let parsedAttributes;
  try {
    parsedAttributes = JSON.parse(attributes);
  } catch {
    throw new ApiError(400, "Invalid address format. Must be a JSON object.");
  }

  console.log("attributes: ", attributes);

  // check if same product exist or not
  const productExist = await Product.findOne({
    vendor: id,
    name,
    attributes: parsedAttributes,
  });

  if (productExist) {
    throw new ApiError(409, "Product already exists");
  }

  if (!Array.isArray(files) || files.length <= 0) {
    throw new ApiError(
      400,
      "Product image is required. Please upload at least one image"
    );
  }

  // Upload images to Cloudinary
  const imageUploadPromises = files.map((file) =>
    uploadOnCloudinary(file.path)
  );
  const cloudinaryResponses = await Promise.all(imageUploadPromises);

  // Filter out failed uploads
  const uploadedImages = cloudinaryResponses
    .filter((res) => res && res.url)
    .map((res) => res.url);

  if (uploadedImages.length === 0) {
    throw new ApiError(500, "Failed to upload product images");
  }

  // Required field check
  if (
    !name ||
    !price ||
    !description ||
    costPrice === undefined ||
    !attributes ||
    !category ||
    !productCatalog
  ) {
    throw new ApiError(400, "All required fields must be provided");
  }

  // Validate referenced IDs
  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    throw new ApiError(404, "Category not found");
  }

  const catalogExists = await ProductCatalog.findById(productCatalog);
  if (!catalogExists) {
    throw new ApiError(404, "Product catalog not found");
  }

  // Vendor from auth
  const vendorId = req.user?._id;
  if (!vendorId) {
    throw new ApiError(403, "Unauthorized: Vendor ID missing");
  }

  let parsedDiscount = undefined;

  if (discount) {
    try {
      // Parse discount if it's a string (likely in form-data)
      parsedDiscount =
        typeof discount === "string" ? JSON.parse(discount) : discount;

      // Destructure and validate essential keys
      const { type, value, fundedBy } = parsedDiscount;
      if (!type || !value || !fundedBy) {
        throw new ApiError(400, "Invalid discount structure");
      }
    } catch {
      // If JSON parsing fails or required keys are missing
      throw new ApiError(
        400,
        "Invalid discount format. Must be a valid JSON object."
      );
    }
  }

  // Calculate final price
  let finalPrice = price;
  if (parsedDiscount) {
    if (parsedDiscount.type === "percentage") {
      finalPrice = price - (price * parsedDiscount.value) / 100;
    } else if (parsedDiscount.type === "fixed") {
      finalPrice = price - parsedDiscount.value;
    }

    finalPrice = Math.max(finalPrice, 0);
  }

  // Save product
  const newProduct = await Product.create({
    name,
    description,
    price,
    costPrice,
    requestedOrganic,
    category,
    discount: parsedDiscount,
    finalPrice,
    attributes: parsedAttributes,
    productCatalog,
    vendor: vendorId,
    stock,
    images: uploadedImages,
  });

  return res.status(201).json(
    new ApiResponse(201, "Product created successfully", {
      id: newProduct._id,
      name: newProduct.name,
      images: uploadedImages,
    })
  );
});

export const getAllProduct = AsyncHandler(async (req, res) => {
  const products = await Product.find()
    .select("-createdAt -updatedAt -__v -requestedOrganic")
    .populate("vendor", "storeName storeLogo");

  if (!products) {
    throw new ApiError(404, "Product list is empty");
  }

  res.status(200).json(new ApiResponse(200, "Products found", { products }));
});
