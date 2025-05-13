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

import userRoute from "./routes/auth.route.ts";
import categoryRoute from "./routes/category.route.ts";
import userProfileRoute from "./routes/userProfile.route.ts";
import adminRoute from "./routes/admin.route.ts";
import vendorRoute from "./routes/vendor.route.ts";

app.use("/api/v1/auth", userRoute);

app.use("/api/v1/user", userProfileRoute);

app.use("/api/v1/admin", adminRoute);

app.use("/api/v1/categories", categoryRoute);

app.use("/api/v1/vendor", vendorRoute);

export { app };
