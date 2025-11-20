import { Router } from "express";
import {
  authMiddleware,
  authorizeRoles,
} from "../middlewares/auth.middleware.js";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getAllParentCategories,
  getCategory,
  updateCategory,
} from "../controllers/category.controller.js";

const router = Router();

////////////////// ADMIN ONLY ROUTE ////////////////////////////////////

router.post("/", authMiddleware, authorizeRoles("admin"), createCategory);

router.put("/:id", authMiddleware, authorizeRoles("admin"), updateCategory);

router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteCategory);

////////////////////// PUBLIC ROUTE ///////////////////////////////////////////
router.get("/:id", getCategory);
router.get("/", getAllCategories);

export default router;
