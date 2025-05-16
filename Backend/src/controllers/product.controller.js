import Product from "../models/product.model.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { productQuerySchema } from "../schema/product.schema.js";

///////////////////// PUBLIC ////////////////////////////////////
export const getProduct = AsyncHandler(async (req, res) => {
  const id = req.params?.id;

  if (!id) {
    throw new ApiError(400, "Product id is required");
  }

  const product = await Product.findById(id).select(
    "-createdAt -updatedAt -__v"
  );

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.status(200).json(new ApiResponse(200, "Product found", product));
});

export const getAllProduct = AsyncHandler(async (req, res) => {
  console.log(req.query);
  const parsed = productQuerySchema.safeParse(req.query);
  console.log("parsed Data: ", parsed.data);

  if (!parsed.success) {
    console.log(parsed.error.flatten());
    throw new ApiError(400, "Invalid query");
  }

  const {
    minPrice = 0,
    maxPrice = Infinity,
    rating = 0,
    organic,
    catalog,
    category,
    page = 1,
  } = parsed.data;

  console.log("query: ", parsed.data);

  const limit = 20;
  const skip = (page - 1) * limit;

  const matchFilter = {
    price: { $gte: minPrice, $lte: maxPrice },
  };

  if (category) {
    matchFilter.category = category;
  }

  if (catalog) {
    matchFilter.catalog = category;
  }

  if (organic != undefined) {
    matchFilter.organic = organic === "true";
  }

  const products = await Product.aggregate([
    // Join with review
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "product",
        as: "reviews",
      },
    },
    // Join with vendor
    {
      $lookup: {
        from: "vendors",
        localField: "vendor",
        foreignField: "_id",
        as: "vendorInfo",
      },
    },
    {
      $addFields: {
        avgRating: { $ifNull: [{ $avg: "$reviews.rating" }, 0] },
      },
    },
    {
      $match: {
        ...matchFilter,
        avgRating: { $gte: rating },
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
    { $unwind: "$vendorInfo" },
    {
      $project: {
        name: 1,
        description: 1,
        images: 1,
        price: 1,
        discount: 1,
        "vendorInfo.storeName": 1,
        "vendorInfo.storeLogo": 1,
        finalPrice: 1,
        avgRating: 1,
        _id: 1,
      },
    },
  ]).sort({ createdAt: -1 });

  if (!products) {
    throw new ApiError(404, "Product list is empty");
  }

  res.status(200).json(new ApiResponse(200, "Products found", { products }));
});
