import axiosClient from '@/api/axios'

export interface Coupon {
  _id: string
  code: string
  type: 'fixed' | 'percentage'
  value: number
  validFrom: string
  validTo: string
  isActive: boolean
  usedCount: number
  maxUsage: number
}

export type CreateCouponInput = Omit<Coupon, '_id' | 'usedCount'>
export type UpdateCouponInput = Partial<Omit<Coupon, '_id' | 'usedCount'>>

export type ApiResponse<T> = {
  statusCode: number
  message: string
  data: T
  success: boolean
}

const BASE_URL = '/api/v1/coupons'

export const couponService = {
  getAllCoupons: async (): Promise<Coupon[]> => {
    const response = await axiosClient.get<ApiResponse<Coupon[]>>(BASE_URL)
    return response.data.data
  },

  addCoupon: async (couponData: CreateCouponInput): Promise<Coupon> => {
    const response = await axiosClient.post<ApiResponse<Coupon>>(
      BASE_URL,
      couponData
    )
    return response.data.data
  },

  updateCoupon: async (
    id: string,
    updateData: UpdateCouponInput
  ): Promise<Coupon> => {
    const response = await axiosClient.put<ApiResponse<Coupon>>(
      `${BASE_URL}/${id}`,
      updateData
    )
    return response.data.data
  },

  deleteCoupon: async (id: string): Promise<string> => {
    const response = await axiosClient.delete<ApiResponse<null>>(
      `${BASE_URL}/${id}`
    )
    return response.data.message
  },
}
