import { LayoutDashboard, ShoppingCart, PackageSearch } from 'lucide-react'
import { AppRoutes } from '@/router/route'

export interface NavLinkItem {
  label: string
  url?: string
  logo?: React.ElementType
  disabled?: boolean
  children?: NavLinkItem[]
}

export const AdminNavLinks: NavLinkItem[] = [
  {
    label: 'Dashboard',
    url: AppRoutes.VENDOR_DASHBOARD,
    logo: LayoutDashboard,
  },
  {
    label: 'Products',
    logo: PackageSearch,
    children: [
      {
        label: 'View All Products',
        url: AppRoutes.VENDOR_PRODUCTS,
        disabled: false,
      },
      {
        label: 'Add Product',
        url: AppRoutes.VENDOR_ADD_PRODUCTS,
        disabled: false,
      },
    ],
  },
  {
    label: 'Orders',
    logo: ShoppingCart,
    children: [
      {
        label: 'Orders History',
        url: AppRoutes.VENDOR_ORDERS,
      },
    ],
  },
]
