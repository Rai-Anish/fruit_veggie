import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  useGetAllCategories,
  useUpdateCategory,
} from '../../hooks/useCategories'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  open: boolean
  onClose: () => void
  category: {
    _id: string
    name: string
    parentCategory:
      | {
          _id: string
          name: string
          slug?: string
        }
      | string
      | null

    description: string
  }
}

const EditCategoryModal = ({ open, onClose, category }: Props) => {
  const { data: parentCategories, isFetching } = useGetAllCategories('parent')
  const [name, setName] = useState(category.name)
  const [parentCategory, setParentCategory] = useState<string | null>(
    typeof category.parentCategory === 'object' &&
      category.parentCategory !== null
      ? category.parentCategory.name
      : (category.parentCategory as string | null)
  )

  const [description, setDescription] = useState(category.description)

  const { mutate: updateCategory, isPending } = useUpdateCategory()
  useEffect(() => {
    if (category) {
      setName(category.name)
      setDescription(category.description)

      if (
        typeof category.parentCategory === 'object' &&
        category.parentCategory !== null
      ) {
        setParentCategory(category.parentCategory._id)
      } else {
        setParentCategory(null)
      }
    }
  }, [category])

  const handleSubmit = () => {
    updateCategory(
      {
        id: category._id,
        data: { name, parentCategory, description },
      },
      {
        onSuccess: () => {
          toast.success('Category updated successfully')
          onClose()
        },
        onError: () => toast.error('Failed to update category'),
      }
    )
  }

  if (isFetching) {
    return <div>Loading...</div>
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="text-foreground">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=""
            />
          </div>

          <div className="space-y-2">
            <Label>Parent Category</Label>
            <Select value={parentCategory} onValueChange={setParentCategory}>
              <SelectTrigger>
                <SelectValue placeholder={parentCategory || ''} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {parentCategories &&
                    parentCategories.map((item) => {
                      return (
                        <SelectItem value={item._id} key={item._id}>
                          {item.name}
                        </SelectItem>
                      )
                    })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <Button onClick={handleSubmit} disabled={isPending}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EditCategoryModal
