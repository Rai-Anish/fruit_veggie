import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from './ui/button'
import { toast } from 'sonner'
import type { UseMutateFunction } from '@tanstack/react-query'

interface Props {
  open: boolean
  onClose: () => void
  deleteFn: UseMutateFunction<unknown, Error, string, unknown>
  id: string
  isDeleteing: boolean
}

const DeleteCellModal = ({
  open,
  onClose,
  deleteFn,
  id,
  isDeleteing,
}: Props) => {
  const handleDelete = () => {
    deleteFn(id, {
      onSuccess: () => {
        toast.success(`Deletion successful`)
        onClose()
      },
      onError: (error) => {
        const errorMessage = error.message || 'Failed to delete.'
        toast.error(errorMessage)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleDelete} type="button" disabled={isDeleteing}>
            {isDeleteing ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteCellModal
