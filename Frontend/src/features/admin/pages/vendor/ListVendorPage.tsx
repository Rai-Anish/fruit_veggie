import React from 'react'

import { useGetAllVendors } from '../../hooks/useVendors'
import { DataTable } from '../../components/vendor/data-table'
import { columns } from '../../components/vendor/columns'

const ListVendorPage = () => {
  const { isFetching: loading, data: vendors } = useGetAllVendors()

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <DataTable columns={columns} data={vendors} />
    </div>
  )
}

export default ListVendorPage
