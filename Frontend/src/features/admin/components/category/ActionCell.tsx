import { useDeleteCategory } from '../../hooks/useCategories'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'
import { type Category } from './columns'
import { useState } from 'react'
import EditCategoryModal from './UpdateCellModal'
import DeleteCellModal from '@/components/DeleteCellModal'

interface Props {
  category: Category
}

const CategoryActionCell = ({ category }: Props) => {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const { mutate: deleteCategory, isPending } = useDeleteCategory()

  return (
    <>
      <EditCategoryModal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        category={category}
      />
      <DeleteCellModal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        deleteFn={deleteCategory}
        id={category._id}
        isDeleteing={isPending}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsDeleteOpen(true)}
            disabled={isPending}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default CategoryActionCell
