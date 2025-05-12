import { Router } from "express";
import {
  authMiddleware,
  authorizeRoles,
} from "../middlewares/auth.middleware.js";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  updateCategory,
} from "../controllers/category.controller.js";

const router = Router();

////////////////// ADMIN ONLY ROUTE ////////////////////////////////////

router.post("/", authMiddleware, authorizeRoles("admin"), createCategory);

router.put("/:id", authMiddleware, authorizeRoles("admin"), updateCategory);

router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteCategory);

////////////////////// PUBLIC ROUTE ///////////////////////////////////////////
router.get("/", getAllCategories);
router.get("/:id", getCategory);

export default router;
