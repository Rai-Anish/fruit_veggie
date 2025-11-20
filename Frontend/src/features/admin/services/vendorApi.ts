import axiosClient from '@/api/axios'

export type status = 'pending' | 'approved' | 'rejected'

export const vendorService = {
  listVendors: async (filter?: status) => {
    const url = filter
      ? `/api/v1/admin/vendors?type=${filter}`
      : `/api/v1/admin/vendors`
    const response = await axiosClient.get(url)
    return response.data
  },

  approveVendor: async (id: string) => {
    const response = await axiosClient.post(`/api/v1/admin/vendors/${id}`)
    return response.data
  },
}
