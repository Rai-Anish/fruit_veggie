import { z } from "zod";

export const vendorSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  password: z.string().min(3),
  storeName: z.string(),
  contactNumber: z.string(),
  address: z.string(),
});
