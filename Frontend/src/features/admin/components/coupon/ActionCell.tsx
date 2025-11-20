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

import { type Coupon } from '../../services/couponApi'
import { useDeleteCoupon } from '../../hooks/useCoupon'
import DeleteCellModal from '@/components/DeleteCellModal'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import CouponForm from './CouponForm'

interface CouponActionCellProps {
  coupon: Coupon
}

const CouponActionCell = ({ coupon }: CouponActionCellProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const { mutate: deleteCoupon, isPending } = useDeleteCoupon()

  return (
    <>
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Coupon</DialogTitle>
          </DialogHeader>
          <CouponForm
            initialCoupon={coupon}
            onClose={() => setIsEditOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <DeleteCellModal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        deleteFn={deleteCoupon}
        id={coupon._id}
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
          <DropdownMenuLabel>Coupon Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setIsEditOpen(true)}>
            Edit Coupon
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsDeleteOpen(true)}
            disabled={isPending}
          >
            Delete Coupon
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default CouponActionCell
