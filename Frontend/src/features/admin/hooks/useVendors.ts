import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { vendorService, type status } from '../services/vendorApi'
import { toast } from 'sonner'

export interface Address {
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface AccountApproval {
  status: 'pending' | 'approved' | 'rejected' | null
}

export interface UserT {
  _id: string
  fullName: string
  email: string
  role: string
  isEmailVerified: boolean
  avatar: string
  createdAt: string
  updatedAt: string
  lastLogin?: string
}

export interface VendorT {
  _id: string
  user: UserT
  storeName: string
  storeLogo: string
  contactNumber: string
  address: Address
  idDocument: string
  isApproved: boolean
  accountApproval: AccountApproval
  createdAt: string
  updatedAt: string
  __v: number
}

export interface VendorsListApiResponse {
  statusCode: number
  message: string
  data: VendorT[]
  success: boolean
}

export interface SingleVendorApiResponse {
  statusCode: number
  message: string
  data: VendorT | null
  success: boolean
}

export const useGetAllVendors = (filter?: status) => {
  return useQuery<VendorT[], Error>({
    queryKey: ['vendors', filter],
    queryFn: async () => {
      const response = await vendorService.listVendors(filter)
      return response.data
    },
    staleTime: 5000 * 60,
  })
}

export const useApproveVendor = () => {
  const queryClient = useQueryClient()

  return useMutation<SingleVendorApiResponse, Error, string>({
    mutationFn: async (vendorId: string) => {
      const response = await vendorService.approveVendor(vendorId)
      return response
    },
    onSuccess: () => {
      toast.success(`Vendor  approved successfully!`)
      queryClient.invalidateQueries({ queryKey: ['vendors'] })
    },
    onError: (error) => {
      toast.error(
        `Failed to approve vendor: ${error.message || 'Unknown error'}`
      )
    },
  })
}
