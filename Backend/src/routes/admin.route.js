import { Router } from "express";
import {
  approveMultipleVendors,
  approveVendorAccount,
  createAdmin,
} from "../controllers/admin.controller.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../middlewares/auth.middleware.js";

import { rateLimiter } from "../middlewares/rateLimit.middleware.js";

const router = Router();

router.post(
  "/create-admin",
  rateLimiter,
  authMiddleware,
  authorizeRoles("admin"),
  createAdmin
);

//////////////////// VENDOR APPROVAL ////////////////////////

router.post(
  "/vendors/approve-multiple",
  authMiddleware,
  authorizeRoles("admin"),
  approveMultipleVendors
);

router.post(
  "/vendors/:id",
  authMiddleware,
  authorizeRoles("admin"),
  approveVendorAccount
);
export default router;
