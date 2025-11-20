import type { UseFormReturn } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useGetAllCategories } from '@/features/admin/hooks/useCategories'
import { useGetAllProductCatalogs } from '@/features/admin/hooks/useProductCatalog'
import { z } from 'zod'
import type { productSchema } from '../../schema/productSchema'
import type { ProductCatalogT } from '@/features/admin/services/productCatalogApi'

type ProductFormValues = z.infer<typeof productSchema>

interface CategoryAndCatalogFieldsProps {
  form: UseFormReturn<ProductFormValues>
  productCatalogs: ProductCatalogT[] | undefined
  isLoadingProductCatalogs: boolean
}

export function CategoryAndCatalogFields({
  form,
  productCatalogs,
  isLoadingProductCatalogs,
}: CategoryAndCatalogFieldsProps) {
  const { data: categories, isFetching } = useGetAllCategories()

  const validCategories = categories || []

  const groupedCategories: Record<
    string,
    { label: string; subcategories: typeof validCategories }
  > = {}

  categories?.forEach((cat) => {
    if (!cat.parentCategory) {
      groupedCategories[cat._id] = {
        label: cat.name,
        subcategories: [],
      }
    }
  })

  categories?.forEach((cat) => {
    if (cat.parentCategory && groupedCategories[cat.parentCategory._id])
      groupedCategories[cat.parentCategory._id].subcategories.push(cat)
  })

  return (
    <div className="lg:grid lg:grid-cols-2 lg:gap-x-7">
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger disabled={isFetching}>
                  {isFetching ? (
                    <span className="text-muted-foreground">
                      Loading categories...
                    </span>
                  ) : (
                    <SelectValue placeholder="Select a category" />
                  )}
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {isFetching && (
                  <SelectItem value="loading-placeholder" disabled>
                    Loading categories...
                  </SelectItem>
                )}
                {!isFetching && Object.keys(groupedCategories).length === 0 && (
                  <SelectItem value="no-categories-placeholder" disabled>
                    No categories found
                  </SelectItem>
                )}

                {!isFetching &&
                  Object.values(groupedCategories).map((group) =>
                    group.subcategories.length > 0 ? (
                      <SelectGroup key={group.label}>
                        <SelectLabel className="text-lg">
                          {group.label}
                        </SelectLabel>
                        {group.subcategories.map((sub) => (
                          <SelectItem
                            className="pl-5"
                            key={sub._id}
                            value={sub._id || ''}
                          >
                            {sub.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ) : (
                      <SelectItem
                        key={group.label}
                        value={
                          validCategories.find(
                            (cat) =>
                              cat.name === group.label &&
                              (!cat.parentCategory || !cat.parentCategory._id)
                          )?._id || ''
                        }
                      >
                        {group.label}
                      </SelectItem>
                    )
                  )}
              </SelectContent>
            </Select>
            <FormDescription>
              Select the specific category for this product.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="productCatalog"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product Catalog</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a product catalog" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {isLoadingProductCatalogs && (
                  <SelectItem value="loading-product-catalogs" disabled>
                    Loading product catalogs...
                  </SelectItem>
                )}
                {!isLoadingProductCatalogs && productCatalogs?.length === 0 && (
                  <SelectItem value="no-product-catalogs" disabled>
                    No product catalogs available
                  </SelectItem>
                )}
                {!isLoadingProductCatalogs &&
                  productCatalogs?.length > 0 &&
                  productCatalogs.map((catalog: any) => (
                    <SelectItem key={catalog._id} value={catalog._id}>
                      {catalog.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Select the specific product catalog.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
