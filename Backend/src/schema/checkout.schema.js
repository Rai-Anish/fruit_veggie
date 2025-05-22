import { z } from "zod";

export const checkoutSchema = z.object({
  user: z.string(),
  cart: z.string(),
  deliveryAddress: z.string(),
  paymentMethod: z.enum(["cashOnDelivery", "creditCard"]),
  subTotal: z.coerce.number(),
  promoCode: z.string().optional(),
  total: z.coerce.number(),
});
