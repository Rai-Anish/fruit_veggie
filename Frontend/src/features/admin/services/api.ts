import axiosClient from '@/api/axios'

export type CategoryT = {
  _id?: string
  name: string
  slug?: string
  description?: string
  parentCategory?: string | null
}

interface UpdateCategoryData {
  id: string
  data: Partial<CategoryT>
}

export const categoryService = {
  addCategory: async (data: Omit<CategoryT, '_id' | 'slug'>) => {
    const response = await axiosClient.post('/api/v1/categories', data)
    return response.data
  },

  updateCategory: async ({ id, data }: UpdateCategoryData) => {
    const response = await axiosClient.put(`/api/v1/categories/${id}`, data)
    return response.data
  },

  deleteCategory: async (id: string) => {
    const response = await axiosClient.delete(`/api/v1/categories/${id}`)
    return response.data
  },

  getAllCategories: async (filter?: 'parent' | 'sub') => {
    const url = filter
      ? `/api/v1/categories?type=${filter}`
      : '/api/v1/categories'
    const response = await axiosClient.get(url)
    return response.data
  },

  getCategoryById: async (id: string) => {
    const response = await axiosClient.get(`/api/v1/categories/${id}`)
    return response.data
  },
}
