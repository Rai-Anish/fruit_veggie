import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import { cartItemSchema } from "../schema/cart.schema.js";
import ApiError from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

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

  // checking is user is same as vendor aka if vendor is trying to buy his own product
  if (user.id === productExist.vendor.toString())
    throw new ApiError("Vendor cannot buy their own products.");

  if (productExist.stock < quantity)
    throw new ApiError(400, "Insufficient stock");

  // Get or create user cart
  let cart = await Cart.findOne({ user: user.id });

  if (!cart) {
    cart = new Cart({ user: user.id, items: [], totalAmount: 0 });
  }

  // check if item alrady in cart
  const existingItem = cart.items.find((item) => item.product.equals(product));

  if (existingItem) {
    //update quantity and subtotal
    existingItem.quantity += quantity;
    existingItem.subTotal = existingItem.quantity * productExist.finalPrice; // multiply cart item quantity by product price
  } else {
    // add new item
    cart.items.push({
      product: productExist._id,
      quantity,
      subTotal: quantity * productExist.finalPrice,
    });
  }

  // calculating totalAmount
  cart.totalAmount = cart.items.reduce((sum, item) => sum + item.subTotal, 0);

  await cart.save();

  res
    .status(200)
    .json(new ApiResponse(200, "Product added to the cart successfully"));
});

export const getCart = AsyncHandler(async (req, res) => {
  const user = req.user;

  const cart = await Cart.findOne({ user: user.id }).select(
    "-createdAt -updatedAt -__v"
  );

  res.status(200).json(new ApiResponse(200, "Cart found", cart));
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
  cartItem.subTotal = quantity * productExist.finalPrice;

  // Recalculate the total amount of the cart
  cart.totalAmount = cart.items.reduce((sum, item) => sum + item.subTotal, 0);

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
