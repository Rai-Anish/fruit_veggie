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
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useAddCoupon, useUpdateCoupon } from '../../hooks/useCoupon'
import { CalendarIcon } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import React from 'react'

import {
  type Coupon,
  type CreateCouponInput,
  type UpdateCouponInput,
} from '../../services/couponApi'

const formSchema = z.object({
  _id: z.string().optional(),
  code: z
    .string({ required_error: 'Coupon code is required' })
    .min(3, {
      message: 'Coupon code must be at least 3 characters.',
    })
    .max(20, {
      message: 'Coupon code must not exceed 20 characters.',
    })
    .regex(/^[A-Z0-9]+$/, {
      message: 'Coupon code must be alphanumeric and uppercase.',
    }),

  type: z.enum(['fixed', 'percentage'], {
    required_error: 'Coupon type is required.',
  }),

  value: z
    .number({ required_error: 'Value is required.' })
    .min(1, { message: 'Value must be at least 1.' })
    .max(10000, { message: 'Value cannot exceed 10,000.' }),

  validFrom: z.date({
    required_error: 'Valid from date is required.',
  }),

  validTo: z
    .date({
      required_error: 'Valid to date is required.',
    })
    .refine((data) => data instanceof Date && !isNaN(data.getTime()), {
      message: "Invalid 'Valid To' date.",
    }),

  maxUsage: z
    .number({ required_error: 'Maximum usage is required.' })
    .int()
    .min(1, { message: 'Maximum usage must be at least 1.' })
    .max(99999, { message: 'Maximum usage cannot exceed 99,999.' }),

  isActive: z.boolean().optional().default(true),
})

interface CouponFormProps {
  initialCoupon?: Coupon
  onClose?: () => void
}

const CouponForm = ({ initialCoupon, onClose }: CouponFormProps) => {
  const isEditMode = !!initialCoupon

  const { mutate: addCoupon, isPending: isAdding } = useAddCoupon()
  const { mutate: updateCoupon, isPending: isUpdating } = useUpdateCoupon()

  type CouponFormValues = z.infer<typeof formSchema>

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialCoupon
      ? {
          _id: initialCoupon._id,
          code: initialCoupon.code,
          type: initialCoupon.type,
          value: initialCoupon.value,
          validFrom: new Date(initialCoupon.validFrom),
          validTo: new Date(initialCoupon.validTo),
          maxUsage: initialCoupon.maxUsage,
          isActive: initialCoupon.isActive ?? true,
        }
      : {
          code: '',
          type: 'fixed',
          value: 0,
          validFrom: new Date(),
          validTo: new Date(new Date().setMonth(new Date().getMonth() + 1)),
          maxUsage: 100,
          isActive: true,
        },
  })

  React.useEffect(() => {
    form.clearErrors('validTo')
    form.trigger('validTo')
  }, [form.watch('validFrom')])

  const {
    formState: { errors },
  } = form

  React.useEffect(() => {
    if (initialCoupon) {
      form.reset({
        _id: initialCoupon._id,
        code: initialCoupon.code,
        type: initialCoupon.type,
        value: initialCoupon.value,
        validFrom: new Date(initialCoupon.validFrom),
        validTo: new Date(initialCoupon.validTo),
        maxUsage: initialCoupon.maxUsage,
        isActive: initialCoupon.isActive,
      })
    } else {
      form.reset({
        code: '',
        type: 'fixed',
        value: 0,
        validFrom: new Date(),
        validTo: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        maxUsage: 100,
        isActive: true,
      })
    }
  }, [initialCoupon, form])

  function onSubmit(values: z.infer<typeof formSchema>) {
    const couponData = {
      code: values.code.toUpperCase(),
      type: values.type,
      value: values.value,
      validFrom: values.validFrom.toISOString(),
      validTo: values.validTo.toISOString(),
      maxUsage: values.maxUsage,
      isActive: values.isActive,
    }

    if (isEditMode) {
      if (!values._id) {
        toast.error('Coupon ID is missing for update.')
        return
      }
      updateCoupon(
        { id: values._id, data: couponData as UpdateCouponInput },
        {
          onSuccess: () => {
            toast.success('Coupon updated successfully!')
            onClose?.()
          },
          onError: (error: any) => {
            toast.error(
              error?.response?.data?.message || 'Failed to update coupon.'
            )
          },
        }
      )
    } else {
      addCoupon(couponData as CreateCouponInput, {
        onSuccess: () => {
          toast.success('Coupon added successfully!')
          form.reset()
          onClose?.()
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Failed to add coupon.')
        },
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coupon Code</FormLabel>
              <FormControl>
                <Input placeholder="e.g., BLACKFRIDAY20" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coupon Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select coupon type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                  <SelectItem value="percentage">Percentage Off</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Whether the coupon offers a fixed amount discount or a
                percentage off.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Value</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g., 10 (for $10 or 10%)"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                />
              </FormControl>
              <FormDescription>
                The discount amount (e.g., 10 for $10 or 10%).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="validFrom"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Valid From</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={`w-[240px] pl-3 text-left font-normal ${
                        !field.value && 'text-muted-foreground'
                      }`}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                The date the coupon becomes active.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="validTo"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Valid To</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={`w-[240px] pl-3 text-left font-normal ${
                        !field.value && 'text-muted-foreground'
                      }`}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => {
                      const validFromDate = form.getValues('validFrom')
                      return date < validFromDate
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>The date the coupon expires.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maxUsage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Usage</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g., 500"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 0)
                  }
                />
              </FormControl>
              <FormDescription>
                The maximum number of times this coupon can be used.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {isEditMode && (
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Is Active</FormLabel>
                  <FormDescription>
                    Whether the coupon is currently active and usable.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        )}

        <Button type="submit" disabled={isAdding || isUpdating}>
          {isEditMode
            ? isUpdating
              ? 'Saving Changes...'
              : 'Save Changes'
            : isAdding
            ? 'Adding Coupon...'
            : 'Add Coupon'}
        </Button>
        {isAdding && !isEditMode && (
          <p className="text-blue-500">Adding coupon...</p>
        )}
        {isUpdating && isEditMode && (
          <p className="text-blue-500">Updating coupon...</p>
        )}
      </form>
    </Form>
  )
}

export default CouponForm
