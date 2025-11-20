import { ProductForm } from '../components/product/ProductForm'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

const AddProductPage = () => {
  return (
    <Card>
      <CardHeader>
        <h1 className="text-2xl font-bold">Add Product</h1>
      </CardHeader>
      <CardContent>
        <ProductForm />
      </CardContent>
    </Card>
  )
}

export default AddProductPage
