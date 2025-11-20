// src/features/auth/types/authSchemas.ts
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(2, 'Password must be at least 6 characters'),
})

export type LoginPayload = z.infer<typeof loginSchema>

export const userProfileSchema = z.object({
  _id: z.string(),
  name: z.string().optional(),
  email: z.string().email(),
  role: z.enum(['admin', 'vendor', 'customer']),
})

export type UserProfile = z.infer<typeof userProfileSchema>

export const signupSchema = z
  .object({
    fullName: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type signupPayload = z.infer<typeof signupSchema>
