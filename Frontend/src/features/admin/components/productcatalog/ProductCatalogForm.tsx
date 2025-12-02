import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useGetAllCategories } from '../../hooks/useCategories'

import { TagsInput } from '@/components/tags'
import { useAddProductCatalog } from '../../hooks/useProductCatalog'

const ProductCatalogFormSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required.'),
  attributes: z.object({
    color: z
      .array(z.string().trim())
      .transform((val) => val.filter((s) => s !== '')),
    type: z
      .array(z.string().trim())
      .transform((val) => val.filter((s) => s !== '')),
    size: z
      .array(z.string().trim())
      .transform((val) => val.filter((s) => s !== '')),
  }),
})

type ProductCatalogFormValues = z.infer<typeof ProductCatalogFormSchema>

const ProductCatalogForm = () => {
  const { data: categories, isFetching } = useGetAllCategories()
  const { mutate: addCatalog, isPending } = useAddProductCatalog()

  const form = useForm<ProductCatalogFormValues>({
    resolver: zodResolver(ProductCatalogFormSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      attributes: {
        color: [],
        type: [],
        size: [],
      },
    },
  })

  function onSubmit(values: ProductCatalogFormValues) {
    addCatalog(values, {
      onSuccess: () => {
        form.reset()
      },
    })
  }

  const validCategories = categories || []

  // Separate parent categories (no parentCategory) and subcategories
  const parentCategories = validCategories.filter(
    (cat) => !cat.parentCategory && cat._id
  )

  const getSubcategories = (parentId: string) => {
    return validCategories.filter((cat) => cat.parentCategory === parentId)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. Organic Apple" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="e.g. Fresh organic apples from the farm."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  {!isFetching && parentCategories.length === 0 && (
                    <SelectItem value="no-categories-placeholder" disabled>
                      No categories found
                    </SelectItem>
                  )}

                  {!isFetching &&
                    parentCategories.map((parent) => {
                      const subcategories = getSubcategories(parent._id!)

                      if (subcategories.length > 0) {
                        return (
                          <SelectGroup key={parent._id}>
                            <SelectLabel>{parent.name}</SelectLabel>
                            {subcategories.map((sub) => (
                              <SelectItem key={sub._id} value={sub._id!}>
                                {sub.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        )
                      }

                      return (
                        <SelectItem key={parent._id} value={parent._id!}>
                          {parent.name}
                        </SelectItem>
                      )
                    })}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the specific category for this product.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-6">
          <FormField
            control={form.control}
            name="attributes.color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Colors</FormLabel>
                <FormControl>
                  <TagsInput {...field} placeholder="e.g. Red, Blue, Green" />
                </FormControl>
                <FormDescription>
                  Type a color and press Enter or comma to add.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="attributes.type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Types</FormLabel>
                <FormControl>
                  <TagsInput
                    {...field}
                    placeholder="e.g. Organic, Conventional"
                  />
                </FormControl>
                <FormDescription>
                  Type a product type and press Enter or comma to add.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="attributes.size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sizes</FormLabel>
                <FormControl>
                  <TagsInput
                    {...field}
                    placeholder="e.g. S, M, L or 1kg, 250g"
                  />
                </FormControl>
                <FormDescription>
                  Type a size and press Enter or comma to add.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? 'Adding Catalog...' : 'Submit Catalog'}
        </Button>
      </form>
    </Form>
  )
}

export default ProductCatalogForm
