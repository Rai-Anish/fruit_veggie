import type { UseFormReturn } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'

import type { ProductFormValues } from '../../schema/productSchema'
import { useEffect, useState } from 'react'
import type { ProductCatalogT } from '@/features/admin/services/productCatalogApi'

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

interface ProductAttributesFieldsProps {
  form: UseFormReturn<ProductFormValues>
  productCatalogs: ProductCatalogT[] | undefined
  isLoadingProductCatalogs?: boolean
}

export function ProductAttributesFields({
  form,
  productCatalogs,
}: ProductAttributesFieldsProps) {
  const selectedProductCatalogId = form.watch('productCatalog')

  const [attr, setAttr] = useState<{
    color?: string[]
    size?: string[]
  }>({})

  useEffect(() => {
    const filter =
      productCatalogs?.filter(
        (item) => item._id === selectedProductCatalogId
      ) || []
    if (filter.length > 0) {
      if (filter[0].attributes && typeof filter[0].attributes === 'object') {
        setAttr(filter[0].attributes)
      } else {
        setAttr({})
      }
    } else {
      setAttr({})
    }
    form.setValue('attributes.color', '', { shouldValidate: true })
    form.setValue('attributes.size', '', { shouldValidate: true })
  }, [productCatalogs, selectedProductCatalogId, form])

  const isCatalogSelected = !!selectedProductCatalogId

  const renderSingleSelectAttribute = (
    attributeType: 'color' | 'size',
    label: string
  ) => {
    const options = attr[attributeType]

    if (!options || options.length === 0) {
      return null
    }

    return (
      <FormField
        control={form.control}
        name={`attributes.${attributeType}`}
        render={({ field }) => (
          <FormItem className="mb-4">
            <FormLabel className="text-base">{label}</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value || ''}
                disabled={!isCatalogSelected}
                className="flex flex-wrap gap-4"
              >
                {options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={option}
                      id={`${attributeType}-${option}`}
                    />
                    <Label htmlFor={`${attributeType}-${option}`}>
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <FormDescription>Choose one {label.toLowerCase()}.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

  return (
    <div className="lg:grid lg:grid-cols-2 lg:gap-x-7">
      {!isCatalogSelected && (
        <p className="col-span-2 text-muted-foreground text-center py-4">
          Select a Product Catalog to view available attributes.
        </p>
      )}

      {renderSingleSelectAttribute('color', 'Color')}

      {renderSingleSelectAttribute('size', 'Size')}
    </div>
  )
}
