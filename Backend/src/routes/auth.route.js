import { Router } from "express";
import {
  getNewAccessToken,
  login,
  logout,
  resendVerifyEmail,
  signUp,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { rateLimiter } from "../middlewares/rateLimit.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

/////////// AUTH ROUTE //////////////////

router.route("/signup").post(signUp);
router.post("/verify-email/:urlToken", verifyEmail);
router.post("/login", rateLimiter, login);
router.get("/logout", authMiddleware, logout);
router.post("/refresh-token", getNewAccessToken);
router.route("/resend-verifyemail").post(rateLimiter, resendVerifyEmail);

export default router;
