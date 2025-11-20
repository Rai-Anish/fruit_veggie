import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import React from 'react'
import { DataTable } from '../components/coupon/data-table'
import { columns } from '../components/coupon/columns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import CouponForm from '../components/coupon/CouponForm'
import { useAddCoupon } from '../hooks/useCoupon'

const ListCouponPage = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const { isSuccess: isAddCouponSuccess } = useAddCoupon()

  React.useEffect(() => {
    if (isAddCouponSuccess) {
      setIsModalOpen(false)
    }
  }, [isAddCouponSuccess])

  return (
    <div>
      <div className="flex justify-end items-center mb-5">
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Add Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            {' '}
            {/* Adjust width if needed */}
            <DialogHeader>
              <DialogTitle>Add New Coupon</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new coupon.
              </DialogDescription>
            </DialogHeader>
            {/* Pass onClose to the form for modal control */}
            <CouponForm onClose={() => setIsModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <DataTable columns={columns} />
      </div>
    </div>
  )
}

export default ListCouponPage
