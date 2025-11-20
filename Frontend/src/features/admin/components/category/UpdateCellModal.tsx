import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useUpdateCategory } from '../../hooks/useCategories'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  open: boolean
  onClose: () => void
  category: {
    _id: string
    name: string
    description: string
  }
}

const EditCategoryModal = ({ open, onClose, category }: Props) => {
  const [name, setName] = useState(category.name)
  const [description, setDescription] = useState(category.description)

  const { mutate: updateCategory, isPending } = useUpdateCategory()
  useEffect(() => {
    if (category) {
      setName(category.name)
      setDescription(category.description)
    }
  }, [category])

  const handleSubmit = () => {
    updateCategory(
      {
        id: category._id,
        data: { name, description },
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
              placeholder="Name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
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
