// src/hooks/useCoupons.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { couponService } from '../services/couponApi'
import type {
  Coupon,
  CreateCouponInput,
  UpdateCouponInput,
} from '../services/couponApi'

const COUPONS_QUERY_KEY = ['coupons']

export const useGetAllCoupons = () => {
  return useQuery<Coupon[], Error>({
    queryKey: COUPONS_QUERY_KEY,
    queryFn: couponService.getAllCoupons,
    staleTime: 1000 * 60 * 5,
  })
}

export const useAddCoupon = () => {
  const queryClient = useQueryClient()
  return useMutation<Coupon, Error, CreateCouponInput>({
    mutationFn: couponService.addCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COUPONS_QUERY_KEY })
      console.log('Coupon added, refetching coupon list.')
    },
    onError: (error) => {
      console.error('Failed to add coupon:', error)
    },
  })
}

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient()
  return useMutation<Coupon, Error, { id: string; data: UpdateCouponInput }>({
    mutationFn: ({ id, data }) => couponService.updateCoupon(id, data),
    onSuccess: (updatedCoupon) => {
      queryClient.invalidateQueries({ queryKey: COUPONS_QUERY_KEY })

      console.log(
        `Coupon ${updatedCoupon._id} updated, refetching coupon list.`
      )
    },
    onError: (error) => {
      console.error('Failed to update coupon:', error)
    },
  })
}

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient()
  return useMutation<string, Error, string>({
    mutationFn: couponService.deleteCoupon,
    onSuccess: (message, deletedId) => {
      queryClient.invalidateQueries({ queryKey: COUPONS_QUERY_KEY })
      console.log(
        `Coupon ${deletedId} deleted: ${message}, refetching coupon list.`
      )
    },
    onError: (error) => {
      console.error('Failed to delete coupon:', error)
    },
  })
}
