import { z } from "zod";

export const couponSchema = z.object({
  code: z.string().nonempty("Coupon code cannot be empty"),
  type: z.enum(["percentage", "fixed"]),
  value: z.coerce.number(),
  validFrom: z.coerce.date(),
  validTo: z.coerce.date(),
  maxUsage: z.coerce.number().int(),
  isActive: z.coerce.boolean(),
});

export const deleteManyCouponSchema = z.object({
  ids: z.array(z.string().min(1, "At least one coupon ID is required")),
});
