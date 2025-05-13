import { Router } from "express";
import {
  forgotPassword,
  getUserProfile,
  resetPassword,
  updateAvatar,
  updateProfile,
} from "../controllers/userProfile.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { rateLimiter } from "../middlewares/rateLimit.middleware.js";

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

export default router;
