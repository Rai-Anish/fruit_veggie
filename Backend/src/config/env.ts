// src/config/env.ts
import { z } from "zod";
import dotenv from "dotenv";
import type { StringValue } from "ms";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  PORT: z.string().default("3000"),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  CORS_ORIGIN: z.string(),

  // JWTs
  JWT_SECRET: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRY_TIME: z.string().min(1),
  REFRESH_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_EXPIRY_TIME: z.string().min(1),

  // Cloudinary
  CLOUDINARY_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),

  // Others
  RESEND_API_KEY: z.string(),
  PASSWORD_RESET_SECRET: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error(
    "Invalid environment variables:",
    _env.error.flatten().fieldErrors
  );
  process.exit(1); // Exit early if env is invalid
}

export const env = {
  ..._env.data,

  // Optional helpers for special types
  get accessTokenExpiry(): StringValue {
    return _env.data.ACCESS_TOKEN_EXPIRY_TIME as StringValue;
  },
  get refreshTokenExpiry(): StringValue {
    return _env.data.REFRESH_TOKEN_EXPIRY_TIME as StringValue;
  },
  get port(): number {
    return parseInt(_env.data.PORT, 10);
  },
};
