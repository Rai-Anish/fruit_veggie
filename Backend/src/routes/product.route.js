import { Router } from "express";
import {
  getAllProduct,
  getProduct,
} from "../controllers/product.controller.js";

const router = Router();

////////////////// PUBLIC ROUTE ////////////////////////////////////

router.get("/", getAllProduct);

router.get("/:id", getProduct);

export default router;
