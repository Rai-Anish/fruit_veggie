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

export interface AuthResponse {
  user: UserProfile
  token: string
  role: 'admin' | 'vendor' | 'customer'
}
