import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
  className?: string
}

export function SearchBar({
  placeholder = 'Search...',
  onSearch,
  className = '',
}: SearchBarProps) {
  const form = useForm<{ query: string }>({
    defaultValues: { query: '' },
  })

  const onSubmit = (data: { query: string }) => {
    onSearch?.(data.query)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`flex items-center gap-2 ${className}`}
      >
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <div className="relative flex items-center">
                  <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    {...field}
                    placeholder={placeholder}
                    className="pl-10 pr-3"
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
