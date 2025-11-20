import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGetVendorProduct } from '../hooks/useVendorProduct'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  defaultValues,
  productSchema,
  type ProductFormValues,
} from '../schema/productSchema'

import { ProductImagesFields } from '../components/product/ImageFields'
import { ProductDetailsFields } from '../components/product/ProductDetailFields'
import { CategoryAndCatalogFields } from '../components/product/SelectField'
import { ProductAttributesFields } from '../components/product/ProductAttributesFields'
import { DiscountFields } from '../components/product/DiscountFields'
import { FinalPriceDisplay } from '../components/product/FinalPriceDisplay'

import { useGetAllCategories } from '@/features/admin/hooks/useCategories'
import { useGetAllProductCatalogs } from '@/features/admin/hooks/useProductCatalog'

import { useUpdateVendorProduct } from '../hooks/useVendorProduct'
import type { CreateProductT } from '../types/product'

type ProductParams = {
  id: string
}

const EditProductPage = () => {
  const { id } = useParams<ProductParams>()
  const navigate = useNavigate()

  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
  } = useGetVendorProduct(id)

  const productData: CreateProductT | undefined = apiResponse?.data

  const { data: categories, isLoading: isLoadingCategories } =
    useGetAllCategories()
  const { data: productCatalogs, isLoading: isLoadingProductCatalogs } =
    useGetAllProductCatalogs()

  const { mutate: updateProduct, isPending } = useUpdateVendorProduct()

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues,
  })

  useEffect(() => {
    if (productData) {
      const imageUrls = productData.images || []

      const normalizedImages = {
        image1: imageUrls[0] || undefined,
        image2: imageUrls[1] || undefined,
        image3: imageUrls[2] || undefined,
        image4: imageUrls[3] || undefined,
        image5: imageUrls[4] || undefined,
      }

      const normalizedDiscount = productData.discount
        ? {
            ...productData.discount,
            validUntil: new Date(productData.discount.validUntil),
          }
        : {
            type: undefined,
            value: undefined,
            validUntil: undefined,
          }

      console.log(productData.discount)
      console.log(normalizedDiscount)
      form.reset({
        ...productData,
        discount: normalizedDiscount,
        product_img_urls: normalizedImages,
        category: productData.category?._id || '',
        productCatalog: productData.productCatalog?._id || '',
      })
    }
  }, [productData, form])

  const handleProductUpdateSuccess = () => {
    toast.success('Product updated successfully!')
    navigate('/vendor/products')
  }

  const onSubmit: SubmitHandler<ProductFormValues> = async (values) => {
    console.log('Form submitted with values:', values)

    // TODO: Transform values to match backend API expectations if necessary (e.g., File objects to FormData)

    // Call the update mutation
    // updateProduct(
    //   { productId: id, updatedProductData: values }, // Adjust payload as per your mutation
    //   {
    //     onSuccess: () => {
    //       handleProductUpdateSuccess();
    //     },
    //     onError: (mutationError) => {
    //       console.error('Error updating product:', mutationError);
    //       toast.error('Failed to update product.', {
    //         description: mutationError.message || 'Please try again.',
    //       });
    //     },
    //   }
    // );
  }

  // --- Render Loading, Error, or Not Found states first ---
  if (
    isLoading ||
    isLoadingCategories ||
    isLoadingProductCatalogs ||
    !productData
  ) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <Skeleton className="h-[400px] w-1/2 rounded-xl" />
        <p>Loading product details...</p>
      </div>
    )
  }

  if (!form.getValues('discount')?.type && form.formState.isLoading) {
    return <p className="text-sm text-muted-foreground">Loading discount...</p>
  }

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold mb-6">
        Edit Product: {productData.name}
      </h2>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <ProductImagesFields form={form} />
            <ProductDetailsFields form={form} />
            <CategoryAndCatalogFields
              form={form}
              categories={categories}
              productCatalogs={productCatalogs}
            />
            <ProductAttributesFields form={form} />
            <DiscountFields form={form} />
            <FinalPriceDisplay form={form} />{' '}
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving Changes...' : 'Save Changes'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default EditProductPage
