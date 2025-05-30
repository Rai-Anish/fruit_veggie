import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

app.use(express.static("public"));

app.use(cookieParser());

/////////////////////// ROUTES /////////////////////////////

import userRoute from "./routes/auth.route.js";
import categoryRoute from "./routes/category.route.js";
import userProfileRoute from "./routes/userProfile.route.js";
import adminRoute from "./routes/admin.route.js";
import vendorRoute from "./routes/vendor.route.js";
import productRoute from "./routes/product.route.js";
import productCatalogRoute from "./routes/productCatalogue.route.js";
import cartRoute from "./routes/cart.route.js";
import couponRoute from "./routes/coupon.route.js";
import checkoutRoute from "./routes/checkout.route.js";
import orderRoute from "./routes/order.route.js";

app.use("/api/v1/auth", userRoute);

app.use("/api/v1/users", userProfileRoute);

app.use("/api/v1/admin", adminRoute);

app.use("/api/v1/categories", categoryRoute);

app.use("/api/v1/vendors", vendorRoute);

app.use("/api/v1/products", productRoute);

app.use("/api/v1/product-catalog", productCatalogRoute);

app.use("/api/v1/carts", cartRoute);

app.use("/api/v1/coupons", couponRoute);

app.use("/api/v1/checkout", checkoutRoute);

app.use("/api/v1/orders", orderRoute);

export { app };
