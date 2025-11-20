import { useGetAllVendorProduct } from '../hooks/useVendorProduct'
import { DataTable } from '@/components/data-table'
import { VendorProductsColumn } from '../components/product/productColumn'
import { toast } from 'sonner'

const VendorProductPage = () => {
  const {
    data: products,
    isFetching,
    isError,
    error,
  } = useGetAllVendorProduct()

  if (isFetching) return <div className="text-center">Loading...</div>

  if (isError) return toast.error(error.message)

  return (
    <div>
      <DataTable columns={VendorProductsColumn} data={products.data} />
    </div>
  )
}

export default VendorProductPage
