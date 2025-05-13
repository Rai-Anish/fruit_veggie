import { z } from "zod";

const otpCodeZodSchema = z.object({
  email: z.string({
    required_error: "Email is required",
  }),
  code: z.string({
    required_error: "Code is required",
  }),
});

export type ZOtpCode = z.infer<typeof otpCodeZodSchema>;
