import { Router } from "express";
import {
  createProductCatalog,
  deleteCatalog,
  getAllCatalog,
  getCatalog,
  updateProductCatalog,
} from "../controllers/productCatalog.controller.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../middlewares/auth.middleware.js";

const router = Router();

/////////////////////////// PRIVATE ROUTES /////////////////////////////////

router.post("/", authMiddleware, authorizeRoles("admin"), createProductCatalog);
router.post(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  updateProductCatalog
);
router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteCatalog);

///////////////////// PUBLIC ROUTES //////////////////////
router.get("/", getAllCatalog);
router.get("/:id", getCatalog);

export default router;
