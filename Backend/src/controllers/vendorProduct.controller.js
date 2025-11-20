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

const normalizeProductData = (rawBody) => {
  const product = { ...rawBody };

  let parsedDiscount = null;
  if (product.discount) {
    if (
      typeof product.discount === "string" &&
      product.discount !== "undefined"
    ) {
      try {
        parsedDiscount = JSON.parse(product.discount);
      } catch (e) {
        console.error("Error parsing discount JSON from request:", e.message);
      }
    } else {
      console.warn(
        "Discount field was not a valid JSON string or was the literal 'undefined'. Ignoring or defaulting."
      );
    }
  }

  let finalDiscount = null;
  if (parsedDiscount) {
    finalDiscount = {
      type: parsedDiscount.type || undefined,
      value:
        typeof parsedDiscount.value === "number"
          ? parsedDiscount.value
          : undefined,
      validUntil: parsedDiscount.validUntil
        ? new Date(parsedDiscount.validUntil)
        : undefined,
    };
    if (Object.values(finalDiscount).every((val) => val === undefined)) {
      finalDiscount = undefined;
    }
  }

  let parsedAttributes = {};
  if (product.attributes) {
    if (
      typeof product.attributes === "string" &&
      product.attributes !== "undefined"
    ) {
      try {
        parsedAttributes = JSON.parse(product.attributes);
      } catch (e) {
        console.error("Error parsing attributes JSON from request:", e.message);
      }
    } else {
      console.warn(
        "Attributes field was not a valid JSON string or was the literal 'undefined'. Defaulting to empty object."
      );
    }
  }
  const finalAttributes = {
    color: parsedAttributes.color || "",
    type: parsedAttributes.type || undefined,
    size: parsedAttributes.size || "",
  };

  return {
    name: product.name,
    price: Number(product.price),
    costPrice: Number(product.costPrice),
    description: product.description,
    requestedOrganic: Boolean(product.requestedOrganic),
    discount: finalDiscount,
    category: product.category,
    attributes: finalAttributes,
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

  console.log("name: ", name);
  console.log("vendor: ", id);
  console.log("attributes: ", attributes);
  // check if same product exist or not
  const productExist = await Product.findOne({
    vendor: vendorExist._id,
    name,
    attributes,
  });

  console.log("productExist: ", productExist);

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
  const products = await Product.find({ vendor: vendorExist.id })
    .select("-createdAt -updatedAt -__v")
    .populate("category", "name")
    .populate("productCatalog", "name");

  if (!products) {
    throw new ApiError(404, "Seems like you haven't listed any products");
  }

  const productWithFinalPrice = products.map((product) => {
    const productObject = product.toObject();

    productObject.finalPrice = finalPriceCalculator(
      productObject.price,
      productObject.discount
    );

    return productObject;
  });

  res
    .status(200)
    .json(new ApiResponse(200, "Products found", productWithFinalPrice));
});

export const getVendorProduct = AsyncHandler(async (req, res) => {
  const user = req.user;
  const { id } = req.params;

  const vendorExist = await Vendor.findOne({ user: user.id });

  if (!vendorExist) {
    throw new ApiError(
      400,
      "Sorry you dont have permission to perform this action"
    );
  }
  const product = await Product.findOne({ vendor: vendorExist.id, _id: id })
    .select("-createdAt -updatedAt -__v")
    .populate("category", "name")
    .populate("productCatalog", "name");

  if (!product) {
    throw new ApiError(404, "Sorry, No specific product found");
  }

  const productWithFinalPrice = product.toObject();

  productWithFinalPrice.finalPrice = finalPriceCalculator(
    productWithFinalPrice.price,
    productWithFinalPrice.discount
  );

  res
    .status(200)
    .json(new ApiResponse(200, "Products found", productWithFinalPrice));
});
