// src/hooks/useCategories.ts
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { categoryService, type CategoryT } from '../services/api'
import { toast } from 'sonner'

export interface ApiResponse<T> {
  statusCode: number
  message: string
  data?: T
  success: boolean
}

export const useGetAllCategories = (filter?: 'parent' | 'sub') => {
  return useQuery<CategoryT[], Error>({
    queryKey: ['categories', filter],
    queryFn: async () => {
      const response = await categoryService.getAllCategories(filter)
      return response.data.categories
    },
    staleTime: 5000 * 60,
  })
}

export const useGetCategoryById = (id: string) => {
  return useQuery<CategoryT, Error>({
    queryKey: ['category', id],
    queryFn: async () => {
      const response = await categoryService.getCategoryById(id)
      return response.data.categories
    },
    enabled: !!id,
  })
}

export const useAddCategory = () => {
  const queryClient = useQueryClient()

  return useMutation<
    ApiResponse<CategoryT>,
    Error,
    Omit<CategoryT, '_id' | 'slug'>
  >({
    mutationFn: (newCategoryData) =>
      categoryService.addCategory(newCategoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: (error) => {
      const errmsg = error?.message || 'An unexpected error occurred.'
      toast.error(errmsg)
    },
  })
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation<
    ApiResponse<CategoryT>,
    Error,
    { id: string; data: Partial<CategoryT> }
  >({
    mutationFn: ({ id, data }) => categoryService.updateCategory({ id, data }),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['category', variables.id] })
      queryClient.setQueryData(
        ['category', variables.id],
        (oldData: CategoryT | undefined) => {
          return oldData ? { ...oldData, ...variables.data } : oldData
        }
      )
    },
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()

  return useMutation<ApiResponse<null>, Error, string>({
    mutationFn: (id) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}
