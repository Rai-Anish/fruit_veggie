import { truncateText } from '@/utils/text'
import { type ColumnDef } from '@tanstack/react-table'
import CategoryActionCell from './ActionCell'
export type CategoryT = {
  _id: string
  name: string
  slug: string
  description: string
  parentCategory?: {
    _id: string
    name: string
    slug: string
  } | null
}

export const columns: ColumnDef<CategoryT>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
  },
  {
    accessorKey: 'parentCategory',
    header: 'Parent Category',
    cell: ({ row }) => {
      const parentCategoryObject = row.original.parentCategory

      if (!parentCategoryObject) {
        return '—'
      }

      return parentCategoryObject.name
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const MAX_DESCRIPTION_LENGTH = 30
      return truncateText(
        row.original.description || '',
        MAX_DESCRIPTION_LENGTH
      )
    },
  },
  {
    accessorKey: 'action',
    header: 'Action',
    cell: ({ row }) => <CategoryActionCell category={row.original} />,
  },
]
