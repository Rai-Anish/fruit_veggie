import { Router } from "express";
import {
  authMiddleware,
  authorizeRoles,
} from "../middlewares/auth.middleware.js";
import {
  addToCart,
  updateCartItem,
  getCart,
  clearCart,
  removeFromCart,
} from "../controllers/cart.controller.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  authorizeRoles("customer", "vendor"), // add item to cart
  addToCart
);

router.put(
  "/",
  authMiddleware,
  authorizeRoles("customer", "vendor"), //update cart item quantity etc
  updateCartItem
);

router.get(
  "/",
  authMiddleware,
  authorizeRoles("customer", "vendor"), //get cart for current user
  getCart
);

router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("customer", "vendor"), // remove item from cart
  removeFromCart
);

router.delete(
  "/",
  authMiddleware,
  authorizeRoles("customer", "vendor"), // clear all items
  clearCart
);

export default router;
