// src/router/routes.ts

export const AppRoutes = {
  // --- Public / Auth Routes ---
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  UNAUTHORIZED: '/unauthorized', // Page for access denied

  // --- Customer Routes ---
  CUSTOMER_HOME: '/', // Public homepage, but customer's entry point
  CUSTOMER_PRODUCTS_SEARCH: '/products', // Generic product search, accessible by all
  CUSTOMER_PRODUCT_DETAIL: '/products/:id', // Public product detail, accessible by all
  CUSTOMER_CART: '/cart',
  CUSTOMER_CHECKOUT: '/checkout',
  CUSTOMER_ORDERS_HISTORY: '/my-orders',
  CUSTOMER_PROFILE: '/my-profile',

  // --- Vendor Routes ---
  VENDOR_DASHBOARD: '/vendor',
  VENDOR_PRODUCTS: '/vendor/products',
  VENDOR_ADD_PRODUCT: '/vendor/products/add',
  VENDOR_EDIT_PRODUCT: '/vendor/products/edit/:id',
  VENDOR_ORDERS: '/vendor/orders',
  VENDOR_SALES_REPORT: '/vendor/sales',
  VENDOR_PROFILE_SETTINGS: '/vendor/profile-settings',

  // --- Admin Routes ---
  ADMIN_DASHBOARD: '/admin',
  ADMIN_USER_MANAGEMENT: '/admin/users',
  ADMIN_USER_DETAIL: '/admin/users/:id',
  ADMIN_VENDOR_VERIFICATION: '/admin/verify-vendors',
  ADMIN_CATEGORY_MANAGEMENT: '/admin/categories',
  ADMIN_ORDER_MANAGEMENT: '/admin/orders',
  ADMIN_SETTINGS: '/admin/settings',
}

// define a default redirect based on role after login
export const getDefaultDashboardRoute = (
  role: 'admin' | 'vendor' | 'customer' | null
): string => {
  switch (role) {
    case 'admin':
      return AppRoutes.ADMIN_DASHBOARD
    case 'vendor':
      return AppRoutes.VENDOR_DASHBOARD
    case 'customer':
      return AppRoutes.CUSTOMER_HOME
    default:
      return AppRoutes.LOGIN //  home
  }
}
