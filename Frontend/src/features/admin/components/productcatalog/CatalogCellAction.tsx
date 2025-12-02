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
import { type ProductCatalogT } from '../../services/productCatalogApi'
import { useState } from 'react'
import DeleteCellModal from '@/components/DeleteCellModal'
import { useDeleteProductCatalog } from '../../hooks/useProductCatalog'

interface Props {
  catalog: ProductCatalogT
}

const CatalogCellAction = ({ catalog }: Props) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const { mutate: deleteCatalog, isPending } = useDeleteProductCatalog()

  return (
    <>
      <DeleteCellModal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        deleteFn={deleteCatalog}
        id={catalog._id}
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

export default CatalogCellAction
