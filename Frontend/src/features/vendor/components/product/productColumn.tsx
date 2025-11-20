import { type ColumnDef } from '@tanstack/react-table'
import type { UpdateProductT } from '../../types/product'
import { truncateText } from '@/utils/text'
import ProductActionCell from './ProductActionCell'

export const VendorProductsColumn: ColumnDef<UpdateProductT>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'price',
    header: 'Price',
  },
  {
    accessorKey: 'costPrice',
    header: 'Cost Price',
  },
  {
    accessorKey: 'finalPrice',
    header: 'Final Price',
  },
  {
    accessorKey: 'stock',
    header: 'Stock',
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
    accessorKey: 'category.name',
    header: 'Category',
  },
  {
    accessorKey: 'productCatalog.name',
    header: 'Catalog',
  },
  {
    accessorKey: 'attributes.color',
    header: 'Color',
  },
  // {
  //   accessorKey: 'attributes.type',
  //   header: 'Type',
  // },
  {
    accessorKey: 'attributes.size',
    header: 'Size',
  },
  {
    accessorKey: 'discount',
    header: 'Discount',
    cell: ({ row }) => {
      const discount = row.original.discount
      if (!discount) {
        return 'N/A'
      }

      const discountValue =
        discount.type === 'percentage'
          ? `${discount.value}%`
          : `${discount.value}`
      const validUntilDate = new Date(discount.validUntil)
      const now = new Date()

      if (now > validUntilDate) {
        // Discount has expired
        return (
          <span className="text-gray-500 line-through">
            {discountValue} (Expired)
          </span>
        )
      }

      return (
        <span className="text-green-600 font-medium">
          {discountValue} (Active)
        </span>
      )
    },
  },
  {
    accessorKey: 'isOrganic',
    header: 'Organic',
  },
  {
    accessorKey: 'action',
    header: 'Action',
    cell: ({ row }) => <ProductActionCell product={row.original} />,
  },
]
