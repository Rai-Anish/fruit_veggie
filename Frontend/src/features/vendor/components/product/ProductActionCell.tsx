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
import { useState } from 'react'

import DeleteCellModal from '@/components/DeleteCellModal'
import type { UpdateProductT } from '../../types/product'
import { useDeleteVendorProduct } from '../../hooks/useVendorProduct'
import { NavLink } from 'react-router-dom'
import { AppRoutes } from '@/router/route'

interface Props {
  product: UpdateProductT
}

const ProductActionCell = ({ product }: Props) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const { mutate: deleteCategory, isPending } = useDeleteVendorProduct()

  const editProductPath = `${AppRoutes.VENDOR}/${AppRoutes.VENDOR_PRODUCTS}/${product._id}` // vendor/product/:id

  return (
    <>
      <DeleteCellModal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        deleteFn={deleteCategory}
        id={product._id}
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
          <DropdownMenuItem>
            <NavLink
              className="w-full h-full"
              to={editProductPath}
              state={{ productData: product }}
            >
              Edit
            </NavLink>
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

export default ProductActionCell
