import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .refine((val) => /[A-Z]/.test(val), {
    message: "Password must contain at least one uppercase letter",
  })
  .refine((val) => /[a-z]/.test(val), {
    message: "Password must contain at least one lowercase letter",
  })
  .refine((val) => /\d/.test(val), {
    message: "Password must contain at least one digit",
  })
  .refine((val) => /[!@#$%^&*]/.test(val), {
    message: "Password must contain at least one special character (!@#$%^&*)",
  });

export const userZodSchema = z.object({
  fullName: z
    .string()
    .min(3, "Minimum 3 letter is required")
    .max(50, "Maximum 50 letter accepted"),
  email: z.string().email(),
  password: passwordSchema,
  role: z.enum(["admin", "vendor", "customer"]),
  isEmailVerified: z.boolean().default(false),
  lastLogin: z.date().optional(),
  refreshToken: z.string().optional(),
  avatar: z.string().optional(),
});

export type ZUser = z.infer<typeof userZodSchema>;
