import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { VendorT } from '../../hooks/useVendors'
import { Mail, Phone, Store } from 'lucide-react'

const VendorCard = ({ vendor }: { vendor: VendorT }) => {
  return (
    <Card className="w-full max-w-sm text-center">
      <CardHeader>
        <img src={vendor?.user?.avatar} />
        <CardTitle> {vendor?.user?.fullName}</CardTitle>
        <div className="font-thin text-sm">
          <div className="flex items-center gap-1 justify-center">
            <Phone size={15} /> +{vendor.contactNumber}
          </div>
          <div className="flex items-center gap-1 justify-center">
            <Mail size={15} />
            {vendor.user.email}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-1 justify-center font-semibold pb-2">
          <Store size={15} /> {vendor.storeName}
        </div>
        <div className="flex justify-between items-center *:flex *:gap-y-2 *:flex-col">
          <div>
            <span className="bg-slate-200 text-black px-5 py-0.5 rounded-xl">
              Items
            </span>
            <span className="font-semibold">12</span>
          </div>
          <div>
            <span className="bg-slate-200 text-black px-5 py-0.5 rounded-xl">
              Sells
            </span>
            <span className="font-semibold">18</span>
          </div>
          <div>
            <span className="bg-slate-200 text-black px-5 py-0.5 rounded-xl">
              Payout
            </span>
            <span className="font-semibold">$300</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default VendorCard
