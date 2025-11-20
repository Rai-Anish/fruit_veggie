import { Router } from "express";
import { signUp } from "../controllers/vendor.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../middlewares/auth.middleware.js";
import {
  createProduct,
  deleteProduct,
  getVendorProduct,
  getVendorProducts,
  updateProduct,
} from "../controllers/vendorProduct.controller.js";
import { streamUpload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post(
  "/signup",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "storeLogo", maxCount: 1 },
    { name: "idDocument", maxCount: 1 },
  ]),
  signUp
);

////////////////////// VENDOR PRODUCTS /////////////////////////
router.post(
  "/products",
  streamUpload.array("product_img_urls", 7), // CREATE
  authMiddleware,
  authorizeRoles("vendor"),
  createProduct
);

router.patch(
  "/products/:id",
  streamUpload.array("product_img_urls", 7), // UPDATE
  authMiddleware,
  authorizeRoles("vendor"),
  updateProduct
);

router.delete(
  "/products/:id",
  authMiddleware,
  authorizeRoles("vendor"), //DELETE
  deleteProduct
);

router.get(
  "/products/:id", ///////////////////// GET SINGLE
  authMiddleware,
  authorizeRoles("vendor"),
  getVendorProduct
);

router.get(
  "/products", ///////////////////// GET
  authMiddleware,
  authorizeRoles("vendor"),
  getVendorProducts
);

export default router;
