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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useAddCategory, useGetAllCategories } from '../../hooks/useCategories'
import slugify from 'slugify'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'

const formSchema = z.object({
  name: z
    .string({ required_error: 'Category name is required' })
    .min(2, {
      message: 'Category name must be at least 2 characters.',
    })
    .max(50, {
      message: 'Category name must not exceed 50 characters.',
    }),
  parentCategory: z
    .string({ required_error: 'Parent category selection is required.' })
    .min(1, { message: 'Please select a parent category.' }),
  slug: z
    .string({ required_error: 'Slug is required' })
    .min(2, {
      message: 'Slug must be at least 2 characters.',
    })
    .max(50, {
      message: 'Slug must not exceed 50 characters.',
    }),
  description: z.string().optional(),
})

const SubCategoryForm = () => {
  const { data: parentCategories } = useGetAllCategories('parent')
  const { mutate: addCategory, isPending, isError, error } = useAddCategory()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      parentCategory: '',
      slug: '',
      description: '',
    },
  })

  const name = form.watch('name')

  React.useEffect(() => {
    if (name) {
      const generatedSlug = slugify(name, { lower: true, strict: true })
      form.setValue('slug', generatedSlug, { shouldValidate: true })
    }
  }, [name, form])

  function onSubmit(values: z.infer<typeof formSchema>) {
    addCategory(
      {
        name: values.name,
        description: values.description,
        parentCategory: values.parentCategory,
      },
      {
        onSuccess: () => {
          toast.success('Sub Category added successfully')
          form.reset()
        },
      }
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormDescription>
                Unique identifier for the URL (auto-generated, but editable).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="parentCategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Parent Category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {parentCategories?.map((item) => {
                    return (
                      <SelectItem key={item._id} value={item._id as string}>
                        {item.name}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
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
                <Textarea {...field} />
              </FormControl>
              <FormDescription>
                Description about the category. (Optional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? 'Adding Category...' : 'Add Category'}
        </Button>
      </form>
    </Form>
  )
}

export default SubCategoryForm
