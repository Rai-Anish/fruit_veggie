import type { UseFormReturn } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import type { ProductFormValues } from '../../schema/productSchema'

interface ProductDetailsFieldsProps {
  form: UseFormReturn<ProductFormValues>
}

export function ProductDetailsFields({ form }: ProductDetailsFieldsProps) {
  return (
    <>
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-7">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Organic Gala Apple" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g., 10.99"
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) => {
                    field.onChange(
                      e.target.value === '' ? null : Number(e.target.value)
                    )
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Tell us a little about the product..."
                className="resize-y"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="lg:grid lg:grid-cols-2 lg:gap-x-7">
        <FormField
          control={form.control}
          name="costPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cost Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g., 8.50"
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) => {
                    field.onChange(
                      e.target.value === '' ? null : Number(e.target.value)
                    )
                  }}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g., 100"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="requestedOrganic"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-border p-4 shadow">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-checked={field.value}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Is Organic?</FormLabel>
              <FormDescription>
                Check this box if the product is certified organic.
              </FormDescription>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
