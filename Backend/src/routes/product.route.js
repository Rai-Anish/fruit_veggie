import { Router } from "express";
import {
  authMiddleware,
  authorizeRoles,
} from "../middlewares/auth.middleware.js";
import {
  createProduct,
  getAllProduct,
} from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

/////////////////// Vendor auth route ///////////////////////////

router.post(
  "/",
  upload.array("product_img_urls", 7),
  authMiddleware,
  authorizeRoles("vendor"),
  createProduct
);

router.get("/", getAllProduct);

export default router;
