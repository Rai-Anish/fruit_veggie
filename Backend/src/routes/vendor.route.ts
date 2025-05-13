import { Router } from "express";
import { signUp } from "../controllers/vendor.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

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

export default router;
