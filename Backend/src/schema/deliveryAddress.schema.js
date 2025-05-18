import { z } from "zod";

export const deliveryAddressSchema = z.object({
  phoneNumber: z
    .string({
      required_error: "Phone number is required",
    })
    .min(8, "Please enter valid phone number"),

  address: z.object({
    street: z.string({
      required_error: "Stree name is required",
    }),
    city: z.string({
      required_error: "Stree name is required",
    }),
    state: z.string({
      required_error: "Stree name is required",
    }),
    postalCode: z.string().optional(),
  }),

  addressLine: z.string({
    required_error: "Please enter your complete address",
  }),

  idDefault: z.coerce.boolean().optional(),
});
