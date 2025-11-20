// src/router/routes.ts

export const AppRoutes = {
  // --- Public / Auth Routes ---
  LOGIN: '/login',
  SIGNUP: '/signup',
  VERIFY_EMAIL: '/verify-email',
  VERIFY_EMAIL_NOTICE: '/verify-email-notice',
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
  VENDOR: '/vendor',
  VENDOR_DASHBOARD: 'dashboard',
  VENDOR_PRODUCTS: 'products',
  VENDOR_EDIT_PRODUCT: 'products/:id',
  VENDOR_ADD_PRODUCTS: 'add-product',
  VENDOR_ORDERS: 'orders',
  VENDOR_SALES_REPORT: 'sales',
  VENDOR_PROFILE_SETTINGS: 'profile',

  // --- Admin Routes ---
  ADMIN: '/admin',
  ADMIN_DASHBOARD: 'dashboard',
  ADMIN_VENDORS_MANAGEMENT: 'vendors',
  ADMIN_VENDORS_DETAIL: 'vendors-detail',
  ADMIN_MAIN_CATEGORIES_MANAGEMENT: 'main-categories',
  ADMIN_SUB_CATEGORIES_MANAGEMENT: 'sub-categories',
  ADMIN_NEW_ORDERS_MANAGEMENT: 'new-orders',
  ADMIN_ORDERS_HISTORY_MANAGEMENT: 'orders-history',
  ADMIN_TRACK_ORDERS_MANAGEMENT: 'orders-track',
  ADMIN_COUPON_LIST: 'coupons',
  ADMIN_COUPON_CREATE: 'create-coupon',
  ADMIN_REVIEWS_MANAGEMENT: 'reviews',
  ADMIN_PRODUCT: 'product',
  ADMIN_PRODUCT_CATALOG: 'product-catalog',
  ADMIN_CUSTOMER: 'customer',
}

// define a default redirect based on role after login
export const getDefaultDashboardRoute = (
  role: 'admin' | 'vendor' | 'customer' | null
): string => {
  switch (role) {
    case 'admin':
      return `${AppRoutes.ADMIN}/${AppRoutes.ADMIN_DASHBOARD}`
    case 'vendor':
      return `${AppRoutes.VENDOR}/${AppRoutes.VENDOR_DASHBOARD}`
    case 'customer':
      return AppRoutes.CUSTOMER_HOME
    default:
      return AppRoutes.LOGIN //  home
  }
}
