import { AsyncHandler } from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  couponSchema,
  deleteManyCouponSchema,
} from "../schema/coupon.schema.js";
import Coupon from "../models/coupon.model.js";

export const createCoupon = AsyncHandler(async (req, res) => {
  const parsed = couponSchema.safeParse(req.body);

  if (!parsed.success) {
    console.log(parsed.error.flatten());
    throw new ApiError(400, "Invalid data", parsed.error.flatten().fieldErrors);
  }

  const couponExist = await Coupon.findOne({ code: parsed.data.code });

  if (couponExist) {
    throw new ApiError(400, "Coupon already exist");
  }

  const coupon = await Coupon.create(parsed.data);

  res
    .status(200)
    .json(new ApiResponse(200, "Coupon created successfully", coupon));
});

export const updateCoupon = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const parsed = couponSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ApiError(400, "Invalid data", parsed.error.flatten());
  }

  const { code, type, validFrom, validTo, maxUsage, value, isActive } =
    parsed.data;

  if (!id) {
    throw new ApiError(400, "Id is required");
  }

  const coupon = await Coupon.findById(id);

  if (!coupon) {
    throw new ApiError(404, "Coupon not found");
  }

  coupon.code = code || coupon.code;
  coupon.type = type || coupon.type;
  coupon.validFrom = validFrom || coupon.type;
  coupon.validTo = validTo || coupon.type;
  coupon.maxUsage = maxUsage || coupon.type;
  coupon.value = value ?? coupon.type;
  coupon.isActive = isActive ?? coupon.isActive;

  await coupon.save();

  res
    .status(200)
    .json(new ApiResponse(200, "Coupon updated successfully", coupon));
});

export const deleteCoupon = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Id is required");
  }

  const coupon = await Coupon.findById(id);

  if (!coupon) {
    throw new ApiError(404, "Coupon not found");
  }

  await coupon.deleteOne();

  res
    .status(200)
    .json(
      new ApiResponse(200, "Coupon deleted successfully", { id: coupon.code })
    );
});

export const deleteManyCoupon = AsyncHandler(async (req, res) => {
  const parsed = deleteManyCouponSchema.safeParse(req.body);

  if (!parsed.success) {
    console.log("err: ", parsed.error.flatten());
    throw new ApiError(400, "Invalid data", parsed.error.flatten().fieldErrors);
  }

  const result = await Coupon.deleteMany({ _id: { $in: parsed.data.ids } });

  res
    .status(200)
    .json(
      new ApiResponse(
        404,
        `${result.deletedCount} coupons deleted successfully.`
      )
    );
});

export const getAllCoupon = AsyncHandler(async (req, res) => {
  const coupons = await Coupon.find()
    .sort({ createdAt: -1 })
    .select("-createdAt -updatedAt -__v");

  if (!coupons) throw new ApiError(404, "No coupon found");

  res.status(200).json(new ApiResponse(200, "Coupon found", coupons));
});
