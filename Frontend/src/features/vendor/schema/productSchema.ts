import { z } from 'zod'

export const UploadedImageSchema = z.object({
  url: z.string().url('Image URL must be a valid URL.'),
  public_id: z.string().optional(),
})

export const discountSchema = z.object({
  type: z.enum(['percentage', 'fixed']),
  value: z.number().min(0),
  validUntil: z.coerce.date().optional(),
})

export const productSchema = z.object({
  name: z.string().min(1, {
    message: 'Product name must be at least 1 character.',
  }),
  price: z.coerce
    .number()
    .positive('Price must be a positive number.')
    .nullable(),
  description: z
    .string()
    .max(5000, 'Description cannot contain more than 5000 characters.'),
  costPrice: z
    .number()
    .positive('Cost price must be a positive number.')
    .nullable(),
  requestedOrganic: z.boolean().optional().default(false),
  discount: discountSchema,
  category: z.string().min(1, { message: 'Category is required.' }),
  attributes: z.object({
    color: z.string().min(1, { message: 'Color is required.' }),
    type: z.string().optional(),
    size: z.string().min(1, { message: 'Size is required.' }),
  }),
  productCatalog: z
    .string()
    .min(1, { message: 'Product Catalog is required.' }),
  stock: z
    .number()
    .int()
    .min(0, { message: 'Stock must be a non-negative integer.' }),
  product_img_urls: z
    .object({
      image1: z.instanceof(File).optional(),
      image2: z.instanceof(File).optional(),
      image3: z.instanceof(File).optional(),
      image4: z.instanceof(File).optional(),
      image5: z.instanceof(File).optional(),
    })
    .superRefine((data, ctx) => {
      const uploadedCount = Object.values(data).filter(Boolean).length
      if (uploadedCount === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['image1'],
          message: 'At least one product image is required.',
        })
      }
    }),
})

export const defaultValues: ProductFormValues = {
  name: '',
  price: null,
  description: '',
  costPrice: null,
  requestedOrganic: false,
  discount: {
    type: 'percentage',
    value: 0,
    validUntil: undefined,
  },
  category: '',
  attributes: {
    color: '',
    type: '',
    size: '',
  },
  productCatalog: '',
  stock: 0,
  product_img_urls: {
    image1: undefined,
    image2: undefined,
    image3: undefined,
    image4: undefined,
    image5: undefined,
  },
}

export type ProductFormValues = z.infer<typeof productSchema>

export type discountT = z.infer<typeof discountSchema>
