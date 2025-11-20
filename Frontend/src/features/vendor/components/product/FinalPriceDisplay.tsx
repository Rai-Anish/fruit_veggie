import { useFormContext } from 'react-hook-form'
import { useMemo } from 'react'
import { type ProductFormValues } from '../../schema/productSchema'
import { Label } from '@/components/ui/label'
import { finalPriceCalculator } from '@/utils/finalPriceCalculator'

export function FinalPriceDisplay() {
  const { watch } = useFormContext<ProductFormValues>()

  const price = watch('price')
  const discountType = watch('discount.type')
  const discountValue = watch('discount.value')
  const discountValidUntil = watch('discount.validUntil')

  const finalPrice = useMemo(() => {
    const basePrice = price === null || price === undefined ? 0 : price
    const discount = {
      type: discountType,
      value: discountValue,
      validUntil: discountValidUntil,
    }
    return finalPriceCalculator(basePrice, discount)
  }, [price, discountType, discountValidUntil, discountValue])

  return (
    <div className="flex items-center justify-between p-4 border border-border rounded-md bg-muted">
      <Label className="text-lg font-semibold">Final Price:</Label>
      <span className="text-lg font-bold dark:text-green-500">
        {typeof finalPrice === 'number' && !isNaN(finalPrice)
          ? finalPrice.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })
          : 'N/A'}
      </span>
    </div>
  )
}
