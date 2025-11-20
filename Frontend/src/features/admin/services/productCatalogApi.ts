import axiosClient from '@/api/axios'

interface Category {
  _id: string
  name: string
}

export interface ProductCatalogAttribute {
  color: string[]
  type: string[]
  size: string[]
}

export interface ProductCatalogT {
  _id: string
  name: string
  description?: string
  attributes: ProductCatalogAttribute
  category: string | Category
  createdAt: string
  updatedAt: string
}

export interface CreateProductCatalogDto {
  name: string
  description?: string
  attributes: ProductCatalogAttribute
  category: string
}

const BASE_URL = '/api/v1/product-catalog'

export const ProductCatalogAPI = {
  getAll: async (): Promise<ProductCatalogT[]> => {
    const response = await axiosClient.get(BASE_URL)
    return response.data.data
  },

  getById: async (id: string): Promise<ProductCatalogT> => {
    const response = await axiosClient.get(`${BASE_URL}/${id}`)
    return response.data.data
  },

  create: async (data: CreateProductCatalogDto): Promise<ProductCatalogT> => {
    const response = await axiosClient.post(BASE_URL, data)
    return response.data.data
  },

  update: async (
    id: string,
    data: CreateProductCatalogDto
  ): Promise<ProductCatalogT> => {
    const response = await axiosClient.patch(`${BASE_URL}/${id}`, data)
    return response.data.data
  },

  delete: async (id: string): Promise<void> => {
    await axiosClient.delete(`${BASE_URL}/${id}`)
  },
}
