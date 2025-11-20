import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { ProductCatalogColumn } from '../components/productcatalog/productCatalogColumn'
import { useGetAllProductCatalogs } from '../hooks/useProductCatalog'
import ProductCatalogForm from '../components/productcatalog/ProductCatalogForm'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

const ProductCatalogPage = () => {
  const { data: catalogData, isLoading, error } = useGetAllProductCatalogs()
  console.log(catalogData)
  const catalogs = catalogData ?? []

  if (isLoading) {
    return (
      <div className="p-6 text-center text-lg">Loading product catalogs...</div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center text-lg text-red-600">
        Error loading product catalogs: {error.message}
      </div>
    )
  }

  return (
    <div className="p-6">
      <div>
        <Dialog>
          <DialogTrigger asChild className="flex justify-end mb-4">
            <div>
              <Button className="flex justify-end mb-4">
                + Add Product Catalog
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent>
            <h1 className="text-xl font-semibold">Create Product Catalog</h1>
            <ProductCatalogForm />
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <DataTable columns={ProductCatalogColumn} data={catalogs} />
      </div>
    </div>
  )
}

export default ProductCatalogPage
