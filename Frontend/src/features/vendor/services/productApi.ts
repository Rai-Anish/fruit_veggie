import axiosClient from '@/api/axios'
import type { CreateProductT, UpdateProductT } from '../types/product'

const url = '/api/v1/vendors/products'

export const vendorProductApi = {
  getAllVendorProduct: async () => {
    const response = await axiosClient.get(url)
    return response.data
  },

  getVendorProduct: async (id: string) => {
    const response = await axiosClient.get(`${url}/${id}`)
    return response.data
  },

  addVendorProduct: async (product: FormData) => {
    const response = await axiosClient.post(url, product)
    return response.data
  },

  updateVendorProduct: async (product: UpdateProductT) => {
    const response = await axiosClient.patch(url, product)
    return response.data
  },

  deleteVendorProduct: async (id: string) => {
    const response = await axiosClient.delete(`${url}/${id}`)
    return response.data
  },
}
