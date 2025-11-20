import React from 'react'
import { useGetAllVendors } from '../../hooks/useVendors' // Assuming this path is correct
import VendorCard from '../../components/vendor/VendorCard'

const VendorDetailPage = () => {
  const { data: vendors, isFetching } = useGetAllVendors()

  if (isFetching) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        Loading...
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-7 ">
      {vendors?.length === 0 && <p>No vendors found.</p>}
      {vendors?.map((vendor) => (
        <VendorCard vendor={vendor} />
      ))}
    </div>
  )
}

export default VendorDetailPage
