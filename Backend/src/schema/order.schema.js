import { z } from "zod";
import mongoose from "mongoose";

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        product: z
          .string()
          .refine((val) => mongoose.Types.ObjectId.isValid(val), {
            message: "Invalid product ID",
          }),
        quantity: z
          .number()
          .int("Quantity must be a whole number")
          .min(1, "Quantity must be at least 1"),
      })
    )
    .min(1, "Order must contain at least one item"),

  deliveryAddress: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid delivery address ID",
    }),
  couponCode: z.string().min(1, "Coupon code cannot be empty").optional(),
  paymentMethod: z.enum(["cash-on-delivery", "credit-card"], {
    errorMap: () => ({ message: "Invalid payment method selected" }),
  }),
});

export const updateOrderSchema = z.object({
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
  deliveryStatus: z
    .enum([
      "placed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "returned",
    ])
    .optional(),
  paidAt: z.coerce.date().optional(),
});
