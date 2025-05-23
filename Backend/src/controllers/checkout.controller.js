import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import Cart from "../models/cart.model.js";
import DeliveryAddress from "../models/deliveryAddress.model.js";
import { cartPriceCalculator } from "../utils/cartPrice.js";
import { applyCoupon } from "../utils/applyCoupon.js";
import Coupon from "../models/coupon.model.js";

export const checkout = AsyncHandler(async (req, res) => {
  const user = req.user;

  // checkout contains -> cart + delivery address + payment method
  const cart = await Cart.findOne({ user: user._id }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    throw new ApiError(404, "Cart is empty");
  }

  const deliveryAddress = await DeliveryAddress.find({ user: user._id });

  if (!deliveryAddress) {
    throw new ApiError(404, "Please set delivery address first");
  }

  const paymentMethod = ["cash-on-delivery", "credit-card"];
  const deliveryFee = 100;

  // calculate price
  const { subTotal, subTotalBeforeDiscount, cartItems } = cartPriceCalculator(
    cart.items
  );

  const total = subTotal + deliveryFee;

  res.status(200).json(
    new ApiResponse(200, "Checkout successfully", {
      cartItems: cartItems,
      deliveryAddress,
      paymentMethod,
      subTotalBeforeDiscount,
      subTotal,
      deliveryFee,
      total,
    })
  );
});

export const applyCouponCheckout = AsyncHandler(async (req, res) => {
  const user = req.user;

  const { couponCode } = req.body;

  console.log("coupon: ", couponCode);

  //  Fetch Cart and Populate Products
  const cart = await Cart.findOne({ user: user._id }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    throw new ApiError(404, "Cart is empty");
  }

  const deliveryFee = 100;

  // Calculate Base Cart Price (before platform coupon)
  const { subTotal: baseSubTotal } = cartPriceCalculator(cart.items);

  // Find and Validate Coupon Document
  const couponDocument = await Coupon.findOne({
    code: couponCode,
  });

  if (!couponDocument) {
    throw new ApiError(400, "Invalid coupon code.");
  }

  const subTotalAfterCoupon = applyCoupon(couponDocument, baseSubTotal);

  // Check if coupon actually applied a discount (i.e., was valid by utility function's rules)
  let discountAmount = 0;
  let message = "Coupon applied successfully!";

  if (subTotalAfterCoupon === baseSubTotal) {
    // The coupon utility returned the original total, meaning it wasn't applicable
    if (couponDocument.isActive === false) message = "Coupon is not active.";
    else if (couponDocument.validFrom && new Date() < couponDocument.validFrom)
      message = "Coupon is not yet valid.";
    else if (couponDocument.validTo && new Date() > couponDocument.validTo)
      message = "Coupon has expired.";
    else if (
      typeof couponDocument.maxUsage === "number" &&
      couponDocument.usedCount >= couponDocument.maxUsage
    )
      message = "Coupon has reached its maximum usage limit.";
    else message = "Coupon cannot be applied to your current cart."; // General fallback
    throw new ApiError(400, message);
  } else {
    discountAmount = baseSubTotal - subTotalAfterCoupon;
  }

  //Calculate Final Total
  const total = subTotalAfterCoupon + deliveryFee;

  res.status(200).json(
    new ApiResponse(200, message, {
      subTotalBeforeCoupon: baseSubTotal,
      subTotalAfterCoupon: subTotalAfterCoupon,
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      deliveryFee,
      total,
      appliedCouponCode: couponCode,
    })
  );
});
