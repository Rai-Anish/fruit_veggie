import Product from "../models/product.model.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Category from "../models/category.model.js";
import { ProductCatalog } from "../models/productCatalog.model.js";
import { uploadStreamOnCloudinary } from "../utils/cloudinary.js"; // import Cloudinary helper
import { productFilesSchema, productSchema } from "../schema/product.schema.js";
import { finalPriceCalculator } from "../utils/finalPriceCalculator.js";
import Vendor from "../models/vendor.model.js";

const uploadImage = async (files) => {
  // Upload images to Cloudinary
  const imageUploadPromises = files.map((file) =>
    uploadStreamOnCloudinary(file.buffer)
  );
  const cloudinaryResponses = await Promise.all(imageUploadPromises);

  // Filter out failed uploads
  const uploadedImages = cloudinaryResponses
    .filter((res) => res && res.url)
    .map((res) => res.url);

  if (uploadedImages.length === 0) {
    throw new ApiError(500, "Failed to upload product images");
  }

  return uploadedImages;
};

const normalizeProductData = (rawProduct) => {
  const product =
    typeof rawProduct === "string" ? JSON.parse(product) : rawProduct;
  product.discount = JSON.parse(product.discount);
  product.attributes = JSON.parse(product.attributes);

  return {
    ...product,
    name: product.name,
    price: Number(product.price),
    costPrice: Number(product.costPrice),
    description: product.description,
    requestedOrganic: Boolean(product.requestedOrganic),
    discount: {
      type: product.discount.type,
      value: Number(product.discount.value),
      validUntil: new Date(product.discount.validUntil),
    },
    category: product.category,
    attributes: {
      color: product.attributes.color,
      type: product.attributes.type,
      size: product.attributes.size,
    },
    productCatalog: product.productCatalog,
    stock: Number(product.stock),
  };
};

export const createProduct = AsyncHandler(async (req, res) => {
  // Get uploaded files
  const files = req.files;
  const id = req.user?._id;
  const rawProduct = req.body;

  if (!rawProduct) {
    throw new ApiError(400, "Product data is missing");
  }

  const normalizedProduct = normalizeProductData(rawProduct);
  const parsed = productSchema.safeParse(normalizedProduct);

  if (!parsed.success) {
    console.log("Validation Error:", parsed.error.flatten().fieldErrors);
    throw new ApiError(
      400,
      "Invalid data type",
      parsed.error.flatten().fieldErrors
    );
  }

  console.log("files", files);

  const parsedFiles = productFilesSchema.safeParse(files);

  if (!parsedFiles.success) {
    console.log(
      "Validation Error:",
      JSON.stringify(parsedFiles.error.flatten().fieldErrors)
    );
    throw new ApiError(
      400,
      JSON.stringify(parsedFiles.error.flatten().fieldErrors)
    );
  }

  // check if vendor exist
  const vendorExist = await Vendor.findOne({ user: id });

  if (!vendorExist) {
    throw new ApiError(
      400,
      "Sorry you don't have permission to perform this action"
    );
  }

  // Extracting product data from request body
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
  } = parsed.data;

  // check if same product exist or not
  const productExist = await Product.findOne({
    vendor: id,
    name,
    attributes,
  });

  if (productExist) {
    throw new ApiError(409, "Product already exists");
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

  //final price
  const finalPrice = finalPriceCalculator(price, discount);

  const uploadedImages = await uploadImage(files);

  // Save product
  const newProduct = await Product.create({
    name,
    description,
    price,
    costPrice,
    requestedOrganic,
    category,
    discount,
    finalPrice,
    attributes,
    productCatalog,
    vendor: vendorExist._id,
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

export const updateProduct = AsyncHandler(async (req, res) => {
  // need product id, user
  const { id } = req.params; // product id
  const user = req.user; // vendor
  const files = req.files; // images
  const rawProduct = req.body;

  const vendorExist = await Vendor.findOne({ user: user.id });

  if (!vendorExist) {
    throw new ApiError(
      400,
      "Sorry you dont have permission to perform this action"
    );
  }

  //check if product exist using product id and vendor id
  const productExist = await Product.findOne({
    _id: id,
    vendor: vendorExist.id,
  });

  if (!productExist) {
    throw new ApiError(404, "Product not found");
  }

  // if exist -> validate incoming data
  // Normalize product
  const product = normalizeProductData(rawProduct);

  const parsed = productSchema.safeParse(product);
  if (!parsed.success) {
    throw new ApiError(400, "Invalid data type", parsed.error.format());
  }

  const parsedFiles = productFilesSchema.safeParse(files);
  if (!parsedFiles.success) {
    throw new ApiError(
      400,
      "Make sure you have provided correct images or video",
      parsedFiles.error.flatten().formErrors
    );
  }

  if (!user) {
    throw new ApiError(401, "You don't have permission");
  }

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
    stock,
  } = parsed.data;

  const fileUpload = await uploadImage(files);

  productExist.name = name ?? productExist.name;
  productExist.price = price ?? productExist.price;
  productExist.description = description ?? productExist.description;
  productExist.costPrice = costPrice ?? productExist.costPrice;
  productExist.requestedOrganic =
    requestedOrganic ?? productExist.requestedOrganic;
  productExist.discount = discount ?? productExist.discount;
  productExist.category = category ?? productExist.category;
  productExist.attributes = attributes ?? productExist.attributes;
  productExist.productCatalog = productCatalog ?? productExist.productCatalog;
  productExist.stock = stock ?? productExist.stock;
  productExist.images = fileUpload ?? productExist.images;
  productExist.finalPrice = finalPriceCalculator(
    productExist.price,
    productExist.discount
  );

  await productExist.save();

  return res
    .status(200)
    .json({ success: true, message: "Product updated successfully" });
});

export const deleteProduct = AsyncHandler(async (req, res) => {
  const id = req.params?.id;
  const user = req.user;

  const vendorExist = await Vendor.findOne({ user: user.id });

  if (!vendorExist) {
    throw new ApiError(
      400,
      "Sorry you dont have permission to perform this action"
    );
  }

  const productExist = await Product.findOne({
    _id: id,
    vendor: vendorExist.id,
  });

  if (!productExist) {
    throw new ApiError(404, "Product not found");
  }

  await productExist.deleteOne();

  res.status(200).json(
    new ApiResponse(200, "Product deleted successfully", {
      id: productExist._id,
    })
  );
});

export const getVendorProducts = AsyncHandler(async (req, res) => {
  const user = req.user;

  const vendorExist = await Vendor.findOne({ user: user.id });

  if (!vendorExist) {
    throw new ApiError(
      400,
      "Sorry you dont have permission to perform this action"
    );
  }
  const products = await Product.find({ vendor: vendorExist.id });

  if (!products) {
    throw new ApiError(404, "Seems like you haven't listed any products");
  }

  res.status(200).json(new ApiResponse(200, "Products found", products));
});
