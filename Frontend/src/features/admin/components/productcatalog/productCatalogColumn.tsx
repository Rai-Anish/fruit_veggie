import { type ColumnDef } from '@tanstack/react-table'
import { type ProductCatalogT } from '../../services/productCatalogApi'
import CatalogCellAction from './CatalogCellAction'

export const ProductCatalogColumn: ColumnDef<ProductCatalogT>[] = [
  { accessorKey: 'name', header: 'Name' },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const category = row.original.category
      return typeof category === 'object' && category !== null
        ? category.name
        : 'N/A'
    },
  },
  {
    accessorKey: 'attributes.color',
    header: 'Colors',
    cell: ({ row }) => {
      const colors = row.original.attributes.color
      return colors && colors.length > 0 ? colors.join(', ') : '-'
    },
  },
  {
    accessorKey: 'attributes.type',
    header: 'Types',
    cell: ({ row }) => {
      const types = row.original.attributes.type
      return types && types.length > 0 ? types.join(', ') : '-'
    },
  },
  {
    accessorKey: 'attributes.size',
    header: 'Sizes',
    cell: ({ row }) => {
      const sizes = row.original.attributes.size
      return sizes && sizes.length > 0 ? sizes.join(', ') : '-'
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const description = row.original.description
      return description && description.length > 50
        ? `${description.substring(0, 50)}...`
        : description || '-'
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt)
      return date instanceof Date && !isNaN(date.getTime())
        ? new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }).format(date)
        : 'Invalid Date'
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <CatalogCellAction catalog={row.original} />,
  },
]
