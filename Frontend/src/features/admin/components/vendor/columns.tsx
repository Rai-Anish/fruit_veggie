import { type ColumnDef } from '@tanstack/react-table'
import { type VendorT } from '../../hooks/useVendors'
import dayjs from 'dayjs'

import VendorActionCell from './ActionCell'
import { truncateText } from '@/utils/text'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'
export const columns: ColumnDef<VendorT>[] = [
  {
    accessorKey: 'storeName',
    header: 'Store Name',
    cell: ({ row }) => {
      return truncateText(row.original.storeName, 30)
    },
  },
  {
    accessorKey: 'storeLogo',
    header: 'Logo',
    cell: ({ row }) => {
      const logoUrl = row.original.storeLogo
      if (!logoUrl) {
        return '—'
      }
      return (
        <img
          src={logoUrl}
          alt={`${row.original.storeName} Logo`}
          className="h-10 w-10 rounded-full object-cover"
        />
      )
    },
  },
  {
    accessorKey: 'contactNumber',
    header: 'Contact Number',
  },
  {
    accessorKey: 'address.city',
    header: 'City',
  },
  {
    accessorKey: 'address',
    header: 'Full Address',
    cell: ({ row }) => {
      const address = row.original.address
      if (!address) {
        return '—'
      }
      return `${address.street}, ${address.city}, ${address.state}, ${address.postalCode}, ${address.country}`
    },
  },
  {
    accessorKey: 'accountApproval.status',
    id: 'accountApprovalStatus',
    header: 'Approval Status',
    cell: ({ row }) => {
      const status = row.original.accountApproval?.status
      if (!status) {
        return 'N/A'
      }
      return status.charAt(0).toUpperCase() + status.slice(1)
    },
  },
  {
    accessorKey: 'isApproved',
    header: 'Approved?',
    cell: ({ row }) => {
      return row.original.isApproved ? 'Yes' : 'No'
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Registered On
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const dateString = row.original.createdAt

      if (!dateString) {
        return 'N/A'
      }

      const date = dayjs(dateString)

      if (!date.isValid()) {
        return 'Invalid Date'
      }
      return date.format('MMM D, YYYY')
    },
  },
  {
    accessorKey: 'idDocument',
    header: 'ID Doc',
    cell: ({ row }) => {
      const docUrl = row.original.idDocument
      if (!docUrl) {
        return '—'
      }
      return (
        <a
          href={docUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          View Document
        </a>
      )
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <VendorActionCell vendor={row.original} />,
  },
]
