import { truncateText } from '@/utils/text'
import { type ColumnDef } from '@tanstack/react-table'
import CategoryActionCell from './ActionCell'

export type Category = {
  _id: string
  name: string
  slug: string
  description: string
  action: string
}

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const MAX_DESCRIPTION_LENGTH = 30
      return truncateText(row.original.description, MAX_DESCRIPTION_LENGTH)
    },
  },
  {
    accessorKey: 'action',
    header: 'Action',
    cell: ({ row }) => <CategoryActionCell category={row.original} />,
  },
]
