import { z } from "zod";

export const categoryZodSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  parentCategory: z.string().optional(),
});
