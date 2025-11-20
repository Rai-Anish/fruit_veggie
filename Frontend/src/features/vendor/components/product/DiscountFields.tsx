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
import type { ProductFormValues } from '../../schema/productSchema'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface DiscountFieldsProps {
  form: UseFormReturn<ProductFormValues>
}

export function DiscountFields({ form }: DiscountFieldsProps) {
  return (
    <fieldset className="space-y-4 rounded-md border border-border p-4">
      <legend className="text-lg font-medium">Discount (Optional)</legend>

      <div className="lg:grid lg:grid-cols-3 lg:gap-x-7">
        <FormField
          control={form.control}
          name="discount.type"
          render={({ field }) => {
            console.log('DISCOUNT TYPE FIELD:', field.value)

            return (
              <FormItem>
                <FormLabel>Discount Type</FormLabel>
                <Select
                  value={field.value || ''}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a discount type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  {field.name}:{field.value}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        <FormField
          control={form.control}
          name="discount.value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount Value</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g., 10 (for 10% or $10)"
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="discount.validUntil"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount Valid Until</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                  value={
                    field.value instanceof Date
                      ? field.value.toISOString().split('T')[0]
                      : ''
                  }
                />
              </FormControl>
              <FormDescription>
                Select the date until the discount is valid.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </fieldset>
  )
}
