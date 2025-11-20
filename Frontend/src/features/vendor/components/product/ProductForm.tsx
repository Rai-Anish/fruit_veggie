import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'

import { useAddVendorProduct } from '../../hooks/useVendorProduct'

import { ProductDetailsFields } from './ProductDetailFields'
import { CategoryAndCatalogFields } from './SelectField'
import {
  productSchema,
  type ProductFormValues,
} from '../../schema/productSchema'
import { ProductAttributesFields } from './ProductAttributesFields'
import { DiscountFields } from './DiscountFields'
import { ProductImagesFields } from './ImageFields'
import { FinalPriceDisplay } from './FinalPriceDisplay'
import { useGetAllProductCatalogs } from '@/features/admin/hooks/useProductCatalog'

export function ProductForm() {
  const { data: productCatalogs, isLoading: isLoadingProductCatalogs } =
    useGetAllProductCatalogs()

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      price: undefined,
      description: '',
      costPrice: undefined,
      requestedOrganic: false,
      discount: undefined,
      category: '',
      attributes: {
        color: '',
        type: '',
        size: '',
      },
      productCatalog: '',
      stock: undefined,
      product_img_urls: {
        image1: undefined,
        image2: undefined,
        image3: undefined,
        image4: undefined,
        image5: undefined,
      },
    },
  })

  const { mutate: addProduct, isPending } = useAddVendorProduct()

  const onSubmit: SubmitHandler<ProductFormValues> = async (values) => {
    const formData = new FormData()

    formData.append('name', values.name)
    formData.append('price', String(values.price))
    formData.append('description', values.description)
    formData.append('costPrice', String(values.costPrice))
    formData.append('requestedOrganic', String(values.requestedOrganic))
    formData.append('category', values.category)
    formData.append('productCatalog', values.productCatalog)
    formData.append('stock', String(values.stock))

    if (values.attributes) {
      formData.append('attributes', JSON.stringify(values.attributes))
    }

    if (
      values.discount &&
      values.discount.type &&
      values.discount.value !== undefined &&
      values.discount.value !== null
    ) {
      formData.append('discount', JSON.stringify(values.discount))
    }

    let fileCount = 0
    Object.values(values.product_img_urls).forEach((file) => {
      if (file instanceof File) {
        formData.append(`product_img_urls`, file)
        fileCount++
      }
    })

    if (fileCount === 0) {
      console.error('At least one product image is required.')
      return
    }

    console.log('FormData being sent:', Array.from(formData.entries()))

    addProduct(formData, {
      onSuccess: () => {
        form.reset()
      },
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <ProductImagesFields form={form} />
        <ProductDetailsFields form={form} />
        <CategoryAndCatalogFields
          productCatalogs={productCatalogs}
          isLoadingProductCatalogs={isLoadingProductCatalogs}
          form={form}
        />
        <ProductAttributesFields
          form={form}
          isLoadingProductCatalogs={isLoadingProductCatalogs}
          productCatalogs={productCatalogs}
        />
        <DiscountFields form={form} />

        <FinalPriceDisplay />

        <Button type="submit" disabled={isPending}>
          {isPending ? 'Adding Product...' : 'Create Product'}
        </Button>
      </form>
    </Form>
  )
}
