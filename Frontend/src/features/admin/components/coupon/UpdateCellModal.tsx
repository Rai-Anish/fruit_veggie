import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import type { CouponT } from './columns'
import { useUpdateCoupon } from '../../hooks/useCoupon'

interface Props {
  open: boolean
  onClose: () => void
  coupon: CouponT
}

const EditCouponModal = ({ open, onClose, coupon }: Props) => {
  const [code, setcode] = useState(coupon.code)

  const { mutate: updatecoupon, isPending } = useUpdateCoupon()
  useEffect(() => {
    if (coupon) {
      setcode(coupon.code)
    }
  }, [coupon])

  const handleSubmit = () => {
    updatecoupon(
      {
        id: coupon._id,
        data: { code },
      },
      {
        onSuccess: () => {
          toast.success('coupon updated successfully')
          onClose()
        },
        onError: () => toast.error('Failed to update coupon'),
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="text-foreground">
        <DialogHeader>
          <DialogTitle>Edit coupon</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="code">code</Label>
            <Input
              value={code}
              onChange={(e) => setcode(e.target.value)}
              placeholder="code"
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

export default EditCouponModal
