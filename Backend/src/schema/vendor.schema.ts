import { z } from "zod";

export const vendorZodSchema = z.object({
  storeName: z
    .string({
      required_error: "Store anme is required",
    })
    .max(50, "Maximum 50 letter accepted"),
  storeLogo: z.string({
    required_error: "Store logo is required",
  }),
  contactNumber: z.string({
    required_error: "Contact number is required",
  }),
  addressLineOne: z.object({
    street: z.string({
      required_error: "Street name is required",
    }),
    city: z.string({
      required_error: "City name is required",
    }),
    state: z.string({
      required_error: "State name is required",
    }),
    postalCode: z.string({
      required_error: "Postal code is required",
    }),
    country: z.string({
      required_error: "Country name is required",
    }),
  }),
  addressLineTwo: z.string({
    required_error: "Please enter your complete address",
  }),
  idDocument: z.string({
    required_error:
      "Government issued Citizenship ID or Driver license is required",
  }),
});

export type ZVendor = z.infer<typeof vendorZodSchema>;
