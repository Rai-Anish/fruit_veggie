import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import { cartItemSchema } from "../schema/cart.schema.js";
import ApiError from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import Vendor from "../models/vendor.model.js";
import { cartPriceCalculator } from "../utils/cartPrice.js";

export const addToCart = AsyncHandler(async (req, res) => {
  // get cart item and user to whom cart belongs -> user must be customer
  const parsed = cartItemSchema.safeParse(req.body);
  const user = req.user;

  // validate the data
  if (!parsed.success) {
    console.log("wht error: ", parsed.error.flatten());
    throw new ApiError(400, "Invalid data", parsed.error.flatten().fieldErrors);
  }

  // destructuring the object data
  const { product, quantity } = parsed.data;

  // get product and check stock
  const productExist = await Product.findById(product);

  if (!productExist) throw new ApiError(404, "Product not found");

  // get vendor associated with product
  const productVendor = await Vendor.findById(productExist.vendor);

  // checking is user is same as vendor aka if vendor is trying to buy his own product
  if (productVendor && user._id.equals(productVendor.user)) {
    throw new ApiError(400, "Vendor cannot buy their own products.");
  }
  console.log(`vendor_id: ${productExist.vendor} and user_id: ${user._id}`);
  if (productExist.stock < quantity)
    throw new ApiError(400, "Insufficient stock");

  // Get or create user cart
  let cart = await Cart.findOne({ user: user.id });

  if (!cart) {
    cart = new Cart({ user: user._id, items: [], totalAmount: 0 });
  }

  // check if item alrady in cart
  const existingItem = cart.items.find((item) => item.product.equals(product));

  if (existingItem) {
    //update quantity
    existingItem.quantity += quantity;
  } else {
    // add new item
    cart.items.push({
      product: productExist._id,
      quantity,
    });
  }

  await cart.save();

  res
    .status(200)
    .json(new ApiResponse(200, "Product added to the cart successfully"));
});

export const getCart = AsyncHandler(async (req, res) => {
  const user = req.user;

  const cart = await Cart.findOne({ user: user._id }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    throw new ApiError(404, "Your cart is empty");
  }

  const { subTotal, cartWithLineTotalAndDiscount } = cartPriceCalculator(
    cart.items
  );

  const deliveryfee = 100;

  res.status(200).json(
    new ApiResponse(200, "Cart found", {
      cartItems: cartWithLineTotalAndDiscount,
      subTotal,
      deliveryfee,
    })
  );
});

export const updateCartItem = AsyncHandler(async (req, res) => {
  const parsed = cartItemSchema.safeParse(req.body);

  if (!parsed.success) {
    console.log("Update Cart Item Validation Error:", parsed.error.flatten());
    throw new ApiError(
      400,
      "Invalid data for updating cart item",
      parsed.error.flatten().fieldErrors
    );
  }

  const { product, quantity } = parsed.data;
  const user = req.user;

  // Find the user's cart
  const cart = await Cart.findOne({ user: user.id });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  // Find the item in the cart to update
  const cartItem = cart.items.find((item) => item.product.equals(product));

  if (!cartItem) {
    throw new ApiError(404, "Product not found in the cart");
  }

  // Update the quantity
  cartItem.quantity = quantity;

  // Fetch the latest product price
  const productExist = await Product.findById(product);
  if (!productExist) {
    throw new ApiError(404, "Product details not found");
  }

  await cart.save();

  res
    .status(200)
    .json(new ApiResponse(200, "Cart item updated successfully", cart));
});

export const removeFromCart = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  if (!id) {
    throw new ApiError(400, "Id is required");
  }

  // Find the user's cart
  const cart = await Cart.findOne({ user: user.id });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  // Delete the product
  cart.items = cart.items.filter((item) => !item.product.equals(id));

  await cart.save();

  res.status(200).json(new ApiResponse(200, "Item removed successfully", cart));
});

export const clearCart = AsyncHandler(async (req, res) => {
  const user = req.user;

  const cart = await Cart.findOne({ user: user.id }).select(
    "-createdAt -updatedAt -__v"
  );

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  (cart.items = []), (cart.totalAmount = 0);

  await cart.save();

  res.status(200).json(new ApiResponse(200, "Cart deleted successfully", cart));
});
