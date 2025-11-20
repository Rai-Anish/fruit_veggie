import { z } from "zod";

export const discount = z.object({
  type: z.enum(["percentage", "fixed"]).optional(),
  value: z.number().optional(),
  validUntil: z.date().optional(),
});

export const productSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(1, "Name must contain atleast 1 letter")
    .max(50),
  price: z.number({ message: "Price must be an number" }),
  description: z.string().max(5000),
  costPrice: z.number(),
  requestedOrganic: z.boolean(),
  discount: discount.nullable().optional(),
  category: z.string(),
  attributes: z
    .object({
      color: z.string().optional(),
      type: z.string().optional(),
      size: z.string().optional(),
    })
    .optional(),
  productCatalog: z.string(),
  stock: z.number(),
});

export const productFilesSchema = z
  .array(
    z.object({
      fieldname: z.string(),
      originalname: z.string(),
      encoding: z.string(),
      mimetype: z.string(),
      buffer: z.instanceof(Buffer),
      size: z.number(),
    })
  )
  .min(1, "At least one product image is required");

export const productQuerySchema = z
  .object({
    minPrice: z.coerce.number().default(0).optional(),
    maxPrice: z.coerce.number().default(Infinity).optional(),
    rating: z.coerce.number().default(0).optional(),
    organic: z.enum(["true", "false"]).optional(),
    catalog: z.string().optional(),
    category: z.string().optional(),
    page: z.coerce.number().default(1).optional(),
  })
  .strict();
