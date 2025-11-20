// middlewares/error.middleware.js

import ApiError from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  // Initialize with generic 500 details
  let statusCode = 500;
  let message = "Internal Server Error";
  let errors = [];

  // Log the error for server-side debugging (important!)
  console.error(
    `[ERROR] Status: ${err.statusCode || 500} - Message: ${err.message} - Path: ${req.originalUrl} - Method: ${req.method}`
  );
  if (err.stack) {
    console.error(err.stack);
  }

  // 1. Handle Custom ApiError first (highest priority for custom errors)
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors || []; // Ensure errors is an array, even if null from constructor
  }
  // 2. Handle specific known errors (usually after custom errors)
  else if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 400;
    message = `Invalid ID: ${err.value}`;
    errors = [{ path: err.path, message: `Invalid ${err.path} format.` }];
  } else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already in use`;
    errors = [{ path: field, message: message }];
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
    errors = Object.values(err.errors).map((el) => ({
      path: el.path,
      message: el.message,
      kind: el.kind,
      value: el.value,
    }));
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please log in again.";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired. Please log in again.";
  }
  // 3. Fallback for any other unexpected errors
  else {
    // In production, generalize unexpected server errors
    if (process.env.NODE_ENV === "production") {
      message = "Something went wrong on our server. Please try again later.";
      errors = [];
    }
    // In development, keep the actual error message
    // statusCode already 500
  }

  // Send the JSON error response
  res.status(statusCode).json({
    statusCode: statusCode,
    success: false,
    message: message,
    errors: errors,
    // Only include stack trace in development for debugging
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
