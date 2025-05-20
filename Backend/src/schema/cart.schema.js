import { z } from "zod";

export const cartItemSchema = z.object({
  product: z
    .string({
      required_error: "Product is required",
    })
    .min(1, "Product ID is required"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
});

export const cartSchema = z.object({
  items: z.array(cartItemSchema),
  totalAmount: z.coerce.number(),
});
