import type {
  ProductCatalogT,
  CreateProductCatalogDto,
} from '../services/productCatalogApi'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ProductCatalogAPI } from '../services/productCatalogApi'

const PRODUCT_CATALOG_QUERY_KEY = 'productCatalogs'

export function useGetAllProductCatalogs() {
  return useQuery<ProductCatalogT[], Error>({
    queryKey: [PRODUCT_CATALOG_QUERY_KEY],
    queryFn: async () => {
      const response = await ProductCatalogAPI.getAll()
      return response.catalogs
    },
  })
}

export function useGetProductCatalog(id: string | null) {
  return useQuery<ProductCatalogT, Error>({
    queryKey: [PRODUCT_CATALOG_QUERY_KEY, id],
    queryFn: () => ProductCatalogAPI.getById(id!),
    enabled: !!id,
  })
}

export function useAddProductCatalog() {
  const queryClient = useQueryClient()
  return useMutation<ProductCatalogT, Error, CreateProductCatalogDto>({
    mutationFn: ProductCatalogAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCT_CATALOG_QUERY_KEY] })
      toast.success('Product Catalog created successfully!')
    },
    onError: (error) => {
      toast.error('Failed to create Product Catalog.', {
        description: error.message,
      })
    },
  })
}

export function useUpdateProductCatalog() {
  const queryClient = useQueryClient()
  return useMutation<
    ProductCatalogT,
    Error,
    { id: string; data: CreateProductCatalogDto }
  >({
    mutationFn: ({ id, data }) => ProductCatalogAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCT_CATALOG_QUERY_KEY] })
      toast.success('Product Catalog updated successfully!')
    },
    onError: (error) => {
      toast.error('Failed to update Product Catalog.', {
        description: error.message,
      })
    },
  })
}

export function useDeleteProductCatalog() {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: ProductCatalogAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCT_CATALOG_QUERY_KEY] })
      toast.success('Product Catalog deleted successfully!')
    },
    onError: (error) => {
      toast.error('Failed to delete Product Catalog.', {
        description: error.message,
      })
    },
  })
}
