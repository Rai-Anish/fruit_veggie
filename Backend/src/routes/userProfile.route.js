import { Router } from "express";
import {
  forgotPassword,
  getUserProfile,
  resetPassword,
  updateAvatar,
  updateProfile,
} from "../controllers/userProfile.controller.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { rateLimiter } from "../middlewares/rateLimit.middleware.js";
import {
  createDeliveryAddress,
  deleteDeliveryAddress,
  getAllDeliveryAddress,
  getDeliveryAddress,
  updateDeliveryAddress,
} from "../controllers/deliveryAddress.controller.js";

const router = Router();

router.get("/", authMiddleware, getUserProfile);

router.post("/forgot-password", rateLimiter, forgotPassword);

router.post("/reset-password", rateLimiter, resetPassword);

router.post("/update-profile", authMiddleware, updateProfile);

router.post(
  "/update-avatar",
  upload.single("avatar"),
  authMiddleware,
  updateAvatar
);

////////////////////// Delivery Address ////////////////////////////

router.post(
  "/delivery-address",
  authMiddleware,
  authorizeRoles("customer"), // CREATE
  createDeliveryAddress
);

router.post(
  "/delivery-address/:id",
  authMiddleware,
  authorizeRoles("customer"), // UPDATE
  updateDeliveryAddress
);

router.delete(
  "/delivery-address/:id",
  authMiddleware,
  authorizeRoles("customer"), // DELETE
  deleteDeliveryAddress
);

router.get(
  "/delivery-address/:id",
  authMiddleware,
  authorizeRoles("customer"), //GET
  getDeliveryAddress
);

router.get(
  "/delivery-address",
  authMiddleware,
  authorizeRoles("customer"), //GET ALL
  getAllDeliveryAddress
);

export default router;
