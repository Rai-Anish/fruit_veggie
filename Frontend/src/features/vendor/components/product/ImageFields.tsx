import type { UseFormReturn } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { ProductFormValues } from '../../schema/productSchema'
import { useState, useEffect, useMemo } from 'react' // Import useMemo
import { Image } from 'lucide-react'

interface ProductImagesFieldsProps {
  form: UseFormReturn<ProductFormValues>
}

export function ProductImagesFields({ form }: ProductImagesFieldsProps) {
  const imageFields = useMemo(() => {
    return ['image1', 'image2', 'image3', 'image4', 'image5'] as const
  }, [])

  const [imagePreviews, setImagePreviews] = useState<
    Record<string, string | null>
  >({})

  const watchedImage1 = form.watch('product_img_urls.image1')
  const watchedImage2 = form.watch('product_img_urls.image2')
  const watchedImage3 = form.watch('product_img_urls.image3')
  const watchedImage4 = form.watch('product_img_urls.image4')
  const watchedImage5 = form.watch('product_img_urls.image5')

  useEffect(() => {
    const newImagePreviews: Record<string, string | null> = {}
    const createdObjectUrls: string[] = []

    const watchedFilesMap: Record<string, File | undefined> = {
      image1: watchedImage1,
      image2: watchedImage2,
      image3: watchedImage3,
      image4: watchedImage4,
      image5: watchedImage5,
    }

    imageFields.forEach((fieldKey) => {
      const selectedFile = watchedFilesMap[fieldKey]
      if (selectedFile instanceof File) {
        const url = URL.createObjectURL(selectedFile)
        newImagePreviews[fieldKey] = url
        createdObjectUrls.push(url)
      } else if (typeof selectedFile === 'string') {
        newImagePreviews[fieldKey] = selectedFile
      } else {
        newImagePreviews[fieldKey] = null
      }
    })

    setImagePreviews(newImagePreviews)

    return () => {
      createdObjectUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [
    form,
    watchedImage1,
    watchedImage2,
    watchedImage3,
    watchedImage4,
    watchedImage5,
    imageFields,
  ])

  return (
    <div className="space-y-4">
      <h1>Product Images</h1>
      <div className="flex gap-4 flex-wrap  ">
        {imageFields.map((fieldKey, index) => {
          const currentImagePreviewUrl = imagePreviews[fieldKey]

          return (
            <FormField
              key={fieldKey}
              control={form.control}
              name={`product_img_urls.${fieldKey}`}
              render={({ field: { onChange, onBlur, name, ref } }) => (
                <FormItem>
                  <FormLabel
                    className="lg:w-44 lg:h-44 border border-border flex items-center justify-center hover:cursor-pointer"
                    htmlFor={name}
                  >
                    {currentImagePreviewUrl ? (
                      <div className="mt-2">
                        <img
                          src={currentImagePreviewUrl}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <Image />
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      id={name}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        onChange(e.target.files ? e.target.files[0] : null)
                      }}
                      onBlur={onBlur}
                      name={name}
                      ref={ref}
                      className="hidden"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )
        })}
      </div>
      {form.formState.errors.product_img_urls?.image1 && (
        <FormMessage>
          {form.formState.errors.product_img_urls.image1.message}
        </FormMessage>
      )}
    </div>
  )
}
