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
import { useAddCategory } from '../../hooks/useCategories'
import slugify from 'slugify'
import React from 'react'
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

const MainCategoryForm = () => {
  const {
    mutate: addCategory,
    isPending,
    isSuccess,
    isError,
    error,
  } = useAddCategory()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
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
      },
      {
        onSuccess: () => {
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
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>Category Slug</FormLabel>
              <FormControl>
                <Input {...field} />
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Description</FormLabel>
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
        {isSuccess && (
          <p className="text-green-500">Category added successfully!</p>
        )}
        {isError && (
          <p className="text-red-500">
            Error:{' '}
            {error?.response?.data?.message || 'An unexpected error occurred.'}
          </p>
        )}
      </form>
    </Form>
  )
}

export default MainCategoryForm
