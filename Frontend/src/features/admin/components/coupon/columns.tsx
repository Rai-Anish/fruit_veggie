import { type ColumnDef } from '@tanstack/react-table'
import CouponActionCell from './ActionCell'

export type CouponT = {
  _id: string
  code: string
  type: 'fixed' | 'percentage'
  value: number
  validFrom: string
  validTo: string
  maxUsage: number
  usedCount: number
  isActive: boolean
}

export const columns: ColumnDef<CouponT>[] = [
  {
    accessorKey: 'code',
    header: 'Coupon Code',
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      return (
        row.original.type.charAt(0).toUpperCase() + row.original.type.slice(1)
      )
    },
  },
  {
    accessorKey: 'value',
    header: 'Value',
    cell: ({ row }) => {
      return row.original.type === 'fixed'
        ? `$${row.original.value.toFixed(2)}`
        : `${row.original.value}%`
    },
  },
  {
    accessorKey: 'validFrom',
    header: 'Valid From',
    cell: ({ row }) => {
      return new Date(row.original.validFrom).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    },
  },
  {
    accessorKey: 'validTo',
    header: 'Valid To',
    cell: ({ row }) => {
      const date = new Date(row.original.validTo)
      const isExpired = date < new Date()
      return (
        <span className={isExpired ? 'text-red-500' : ''}>
          {date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
          {isExpired && ' (Expired)'}
        </span>
      )
    },
  },
  {
    accessorKey: 'usage',
    header: 'Usage',
    cell: ({ row }) => {
      return `${row.original.usedCount} / ${row.original.maxUsage}`
    },
  },
  {
    accessorKey: 'isActive',
    header: 'Active',
    cell: ({ row }) => {
      return row.original.isActive ? (
        <span className="text-green-500 font-medium">Yes</span>
      ) : (
        <span className="text-red-500 font-medium">No</span>
      )
    },
  },
  {
    accessorKey: 'action',
    header: 'Action',
    cell: ({ row }) => <CouponActionCell coupon={row.original} />,
    enableSorting: false,
    enableColumnFilter: false,
  },
]
