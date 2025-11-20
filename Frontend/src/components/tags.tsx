import * as React from 'react'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TagsInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  className?: string
}

const TagsInput = React.forwardRef<HTMLInputElement, TagsInputProps>(
  ({ value, onChange, placeholder, className, ...props }, ref) => {
    const [inputValue, setInputValue] = React.useState('')

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value)
    }

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault()
        const newTag = inputValue.trim()
        if (newTag && !value.includes(newTag)) {
          onChange([...value, newTag])
          setInputValue('')
        }
      } else if (e.key === 'Backspace' && inputValue === '') {
        e.preventDefault()
        const newTags = [...value]
        newTags.pop()
        onChange(newTags)
      }
    }

    const handleRemoveTag = (tagToRemove: string) => {
      onChange(value.filter((tag) => tag !== tagToRemove))
    }

    return (
      <div
        className={cn(
          'flex flex-wrap items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
          className
        )}
      >
        {value.map((tag, index) => (
          <Badge key={index} variant="secondary" className="pr-1">
            {tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="ml-1 rounded-full p-0.5 hover:bg-muted"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <Input
          ref={ref}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
          className="flex-grow min-w-[150px] border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
          {...props}
        />
      </div>
    )
  }
)

TagsInput.displayName = 'TagsInput'

export { TagsInput }
