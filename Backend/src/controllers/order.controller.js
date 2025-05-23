import {
  createOrderSchema,
  updateOrderSchema,
} from "../schema/order.schema.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Order from "../models/order.model.js";
import DeliveryAddress from "../models/deliveryAddress.model.js";
import Product from "../models/product.model.js";
import Coupon from "../models/coupon.model.js";
import { finalPriceCalculator } from "../utils/finalPriceCalculator.js";
import { applyCoupon } from "../utils/applyCoupon.js";
import User from "../models/user.model.js";
import Cart from "../models/cart.model.js";

export const createOrder = AsyncHandler(async (req, res) => {
  console.log("Received request body:", req.body);
  // need deliveryaddress, payment method type, cart items
  const userId = req?.user?._id;
  const parsed = createOrderSchema.safeParse(req.body);

  if (!parsed.success) {
    console.log(parsed.error.flatten());
    throw new ApiError(400, "Invalid data");
  }

  const { items, couponCode, deliveryAddress, paymentMethod } = parsed.data;

  // get delivery address snapshot
  const address = await DeliveryAddress.findById(deliveryAddress).select(
    "_id phoneNumber address addressLine"
  );

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  // subTotal
  let subTotal = 0;

  // product and vendor
  const productList = await Promise.all(
    items.map(async (item) => {
      const product = await Product.findById(item.product).populate("vendor");

      // check if vendor is buying their own product
      const vendorUser = await User.findById(product.vendor.user);
      if (vendorUser._id.equals(userId)) {
        throw new ApiError(401, "Vendor cannot buy their own product");
      }
      const productObject = product.toObject();
      productObject.quantity = item.quantity;

      const finalPrice = finalPriceCalculator(
        productObject.price,
        productObject.discount
      );
      const lineTotal = finalPrice * productObject.quantity;
      const lineTotalBeforeDiscount =
        productObject.price * productObject.quantity;

      subTotal += lineTotal;

      return {
        productId: productObject._id,
        productName: productObject.name,
        vendorId: productObject.vendor._id,
        storeName: productObject.vendor.storeName,
        quantity: productObject.quantity,
        price: productObject.price, // original price
        discount: {
          type: productObject.discount.type,
          value: productObject.discount.value,
          validUntil: productObject.discount.validUntil,
        },
        finalPrice: finalPrice, // price after discount
        lineTotal: lineTotal, // quantity * finalPrice
        lineTotalBeforeDiscount, // quantity * price
      };
    })
  );

  // coupon code
  let subTotalAfterCoupon = subTotal;
  let couponSnapshot;

  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode });
    if (coupon) {
      subTotalAfterCoupon = applyCoupon(coupon, subTotal);

      //// create new coupon with discount amount
      couponSnapshot = {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discountedAmount: parseFloat(subTotal - subTotalAfterCoupon).toFixed(2),
      };

      if (subTotal > subTotalAfterCoupon) {
        coupon.usedCount = coupon.usedCount + 1;
        await coupon.save();
      }
    }
  }

  const deliveryFee = 100;

  const total = subTotalAfterCoupon + deliveryFee;

  //payment status
  let paymentStatus = "pending";
  if (paymentMethod === "credit-card") {
    paymentStatus = "paid";
  }

  const order = await Order.create({
    customer: userId,
    items: productList,
    deliveryAddress: address.toObject(),
    subTotal: subTotal,
    coupon: couponSnapshot,
    deliveryFee,
    totalAmount: total,
    paymentMethod,
    paymentStatus,
    paidAt: new Date(),
    deliveryStatus: "placed",
  });

  if (order) {
    // empty cart
    await Cart.findOneAndUpdate(
      { user: userId },
      {
        $set: {
          items: [],
        },
      }
    );
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Order placed successfully", order._id));
});

export const getOrders = AsyncHandler(async (req, res) => {
  const orders = await Order.find();

  if (!orders || orders.length === 0) {
    throw new ApiError(400, "Your order list is empty");
  }

  res.status(200).json(new ApiResponse(200, "Order list found", orders));
});

export const updateOrder = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const parsed = updateOrderSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ApiError(400, "Invalid data");
  }

  const { paymentStatus, deliveryStatus, paidAt } = parsed.data;

  const order = await Order.findById(id);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  order.paymentStatus = paymentStatus;
  order.deliveryStatus = deliveryStatus;
  order.paidAt = paidAt;

  await order.save();

  const updatedOrder = await Order.findById(id);

  res
    .status(200)
    .json(new ApiResponse(200, "Order updated successfully", updatedOrder));
});

export const getUserOrder = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const order = await Order.findOne({ _id: id, customer: userId });

  if (!order) {
    throw new ApiError(200, "No order found");
  }

  res.status(200).json(new ApiResponse(200, "Order found", order));
});
