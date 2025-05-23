import { Router } from "express";
import {
  createOrder,
  getOrders,
  updateOrder,
  getUserOrder,
} from "../controllers/order.controller.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  authorizeRoles("vendor", "customer"),
  createOrder
);

router.get(
  "/:id",
  authMiddleware,
  authorizeRoles("customer", "vendor"),
  getUserOrder
);

////////////////// ADMIN ONLY //////////////////////
router.get("/", authMiddleware, authorizeRoles("admin"), getOrders);

router.put("/:id", authMiddleware, authorizeRoles("admin"), updateOrder);

export default router;
