import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

export const authMiddleware = AsyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies.accessToken || req.header("Authorization")?.split(" ")[1];

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded?.id).select(
      "_id fullName role email lastLogin"
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    const user = req.user;
    if (!user || !roles.includes(user.role)) {
      throw new ApiError(
        403,
        "You donot have permission to perform this action"
      );
    }

    next();
  };
};
