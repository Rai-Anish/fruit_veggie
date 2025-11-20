// middleware/rateLimitResend.js
import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 500, // limit each IP to 3 requests per windowMs
  message: {
    status: 429,
    message: "Too many resend attempts. Please try again in 5 minutes.",
  },
});
