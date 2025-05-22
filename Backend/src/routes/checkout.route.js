import { Router } from "express";
import {
  applyCouponCheckout,
  checkout,
} from "../controllers/checkout.controller.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, authorizeRoles("vendor", "customer"), checkout);

router.post(
  "/apply-coupon",
  authMiddleware,
  authorizeRoles("vendor", "customer"),
  applyCouponCheckout
);
export default router;
