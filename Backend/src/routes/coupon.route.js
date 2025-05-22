import { Router } from "express";
import {
  createCoupon,
  deleteCoupon,
  deleteManyCoupon,
  getAllCoupon,
  updateCoupon,
} from "../controllers/coupon.controller.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, authorizeRoles("admin"), createCoupon); // CREATE

router.put("/:id", authMiddleware, authorizeRoles("admin"), updateCoupon); // update

router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteCoupon); // delete

router.delete("/", authMiddleware, authorizeRoles("admin"), deleteManyCoupon); // delete many

router.get("/", authMiddleware, authorizeRoles("admin"), getAllCoupon); // GET ALL

export default router;
