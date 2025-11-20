import { toast } from 'sonner'
import { vendorProductApi } from '../services/productApi'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const VP_QUERY_KEY = ['vendor-product']
const VP_SINGLE_PRODUCT_QUERY_KEY = 'vendorProduct'

export const useGetAllVendorProduct = () => {
  return useQuery({
    queryKey: VP_QUERY_KEY,
    queryFn: vendorProductApi.getAllVendorProduct,
    staleTime: 1000 * 5 * 60,
  })
}

export const useGetVendorProduct = (id: string | undefined) => {
  return useQuery({
    queryKey: [VP_SINGLE_PRODUCT_QUERY_KEY, id],
    queryFn: () => vendorProductApi.getVendorProduct(id as string),
    staleTime: 1000 * 5 * 60, // 5 minutes
    enabled: !!id,
  })
}

export const useAddVendorProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: vendorProductApi.addVendorProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VP_QUERY_KEY })
      toast.success('Product added successfully')
    },
    onError: (error) => {
      console.log(error)
      const errMsg = error.response.data.message || 'Something went wrong'
      toast.error(errMsg)
    },
  })
}

export const useUpdateVendorProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: vendorProductApi.updateVendorProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VP_QUERY_KEY })
      toast.success('Product updated successfully')
    },
    onError: (error) => {
      const errMsg = error.response.data?.error || 'Something went wrong'
      toast.error(errMsg)
    },
  })
}

export const useDeleteVendorProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: vendorProductApi.deleteVendorProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VP_QUERY_KEY })
      toast.success('Product deleted successfully')
    },
    onError: (error) => {
      const errMsg = error.response.data?.error || 'Something went wrong'
      toast.error(errMsg)
    },
  })
}
