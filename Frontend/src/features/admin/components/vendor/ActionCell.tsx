import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { CircleArrowDown, MoreHorizontal, Pickaxe } from 'lucide-react'
import { useApproveVendor, type VendorT } from '../../hooks/useVendors'

interface Props {
  vendor: VendorT
}

const VendorActionCell = ({ vendor }: Props) => {
  const { mutate: approveVendor, isPending } = useApproveVendor()
  const buttonDisable = vendor.accountApproval.status !== 'pending' || isPending
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="hover:bg-transparent hover:text-accent-foreground dark:hover:bg-transparent p-0"
          >
            <span className="sr-only">Open menu</span>
            <div className=" bg-blue-400 hover:text-black rounded-xl px-3  flex gap-2 items-center py-1 justify-between">
              <Pickaxe /> Action
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={buttonDisable}
            onClick={() => approveVendor(vendor._id)}
          >
            Approve Vendor
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={buttonDisable}
            onClick={() => approveVendor(vendor._id)}
          >
            Reject Vendor
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default VendorActionCell
