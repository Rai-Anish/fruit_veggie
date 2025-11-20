import {
  Store,
  Users,
  LayoutDashboard,
  ChartBarStacked,
  ShoppingCart,
  Star,
  PackageSearch,
  Puzzle,
} from 'lucide-react'
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
    url: AppRoutes.ADMIN_DASHBOARD,
    logo: LayoutDashboard,
  },
  {
    label: 'Users',
    logo: Users,
    children: [
      {
        label: 'View All Users',
        url: AppRoutes.ADMIN_CUSTOMER,
        disabled: true,
      },
    ],
  },
  {
    label: 'Vendors',
    logo: Store,
    children: [
      {
        label: 'View All Vendors',
        url: AppRoutes.ADMIN_VENDORS_MANAGEMENT,
      },
      {
        label: 'Vendor Details',
        url: AppRoutes.ADMIN_VENDORS_DETAIL,
      },
    ],
  },
  {
    label: 'Categories',
    logo: ChartBarStacked,
    children: [
      {
        label: 'Main Category',
        url: AppRoutes.ADMIN_MAIN_CATEGORIES_MANAGEMENT,
      },
      {
        label: 'Sub Category',
        url: AppRoutes.ADMIN_SUB_CATEGORIES_MANAGEMENT,
      },
    ],
  },
  {
    label: 'Orders',
    logo: ShoppingCart,
    children: [
      {
        label: 'Orders History',
        url: AppRoutes.ADMIN_ORDERS_HISTORY_MANAGEMENT,
      },
      {
        label: 'Track Orders',
        url: AppRoutes.ADMIN_TRACK_ORDERS_MANAGEMENT,
      },
    ],
  },
  {
    label: 'Products',
    logo: PackageSearch,
    children: [
      {
        label: 'View All Products',
        url: AppRoutes.ADMIN_PRODUCT,
        disabled: true,
      },
      {
        label: 'Product Catalog',
        url: AppRoutes.ADMIN_PRODUCT_CATALOG,
        disabled: false,
      },
    ],
  },
  {
    label: 'Coupon',
    url: AppRoutes.ADMIN_COUPON_LIST,
    logo: Puzzle,
  },
  // {
  //   label: 'Reviews',
  //   url: AppRoutes.ADMIN_REVIEWS_MANAGEMENT,
  //   logo: Star,
  // },
]
