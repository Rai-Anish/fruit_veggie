import { Routes, Route } from 'react-router-dom'
import { AppRoutes } from './router/route'
import {
  Dashboard,
  ListVendor,
  ApproveVendor,
  MainCategory,
  SubCategory,
  OrderHistory,
  TrackOrder,
  ListCoupon,
  Reviews,
  ProductCatalog,
} from './features/admin/pages'
import PublicRoute from './router/PublicRoute'
import LoginPage from './features/auth/pages/LoginPage'
import SignupPage from './features/auth/pages/SignupPage'
import VerifyEmailNoticePage from './features/auth/pages/VerifyEmailNoticePage'
import VerifyEmailPage from './features/auth/pages/VerifyEmailPage'
import ProtectedRoute from './router/ProtectedRoute'
import AdminLayout from './features/admin/AdminLayout'
import useAuthCheck from './features/auth/hooks/useAuthCheck'
import HomePage from './pages/HomePage'
import VendorLayout from './features/vendor/VendorLayout'
import {
  VendorAddProduct,
  VendorDashboard,
  VendorEditProduct,
  VendorOrders,
  VendorProducts,
} from './features/vendor/pages'

function App() {
  const { isLoading: isAuthLoading } = useAuthCheck()

  if (isAuthLoading) {
    return <div>loading</div>
  }
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      {/* --- Public & Authentication Routes --- */}

      {/* These routes are accessible to unauthenticated users, but redirect authenticated users */}
      <Route element={<PublicRoute />}>
        <Route path={AppRoutes.LOGIN} element={<LoginPage />} />
        <Route path={AppRoutes.SIGNUP} element={<SignupPage />} />
      </Route>
      <Route
        path={AppRoutes.VERIFY_EMAIL_NOTICE}
        element={<VerifyEmailNoticePage />}
      />
      <Route path={AppRoutes.VERIFY_EMAIL} element={<VerifyEmailPage />} />

      {/* ADMIN ONLY ROUTE*/}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<AdminLayout />} path={AppRoutes.ADMIN}>
          <Route path={AppRoutes.ADMIN_DASHBOARD} element={<Dashboard />} />
          <Route
            path={AppRoutes.ADMIN_VENDORS_MANAGEMENT}
            element={<ListVendor />}
          />
          <Route
            path={AppRoutes.ADMIN_VENDORS_DETAIL}
            element={<ApproveVendor />}
          />
          <Route
            path={AppRoutes.ADMIN_MAIN_CATEGORIES_MANAGEMENT}
            element={<MainCategory />}
          />
          <Route
            path={AppRoutes.ADMIN_SUB_CATEGORIES_MANAGEMENT}
            element={<SubCategory />}
          />
          <Route
            path={AppRoutes.ADMIN_PRODUCT_CATALOG}
            element={<ProductCatalog />}
          />
          <Route
            path={AppRoutes.ADMIN_ORDERS_HISTORY_MANAGEMENT}
            element={<OrderHistory />}
          />
          <Route
            path={AppRoutes.ADMIN_TRACK_ORDERS_MANAGEMENT}
            element={<TrackOrder />}
          />
          <Route path={AppRoutes.ADMIN_COUPON_LIST} element={<ListCoupon />} />

          <Route
            path={AppRoutes.ADMIN_REVIEWS_MANAGEMENT}
            element={<Reviews />}
          />
        </Route>
      </Route>
      {/* END OF ADMIN ONLY ROUTES*/}

      {/* VENDOR ONLY ROUTE */}
      <Route element={<ProtectedRoute allowedRoles={['vendor']} />}>
        <Route element={<VendorLayout />} path={AppRoutes.VENDOR}>
          <Route
            path={AppRoutes.VENDOR_DASHBOARD}
            element={<VendorDashboard />}
          />
          <Route
            path={AppRoutes.VENDOR_PRODUCTS}
            element={<VendorProducts />}
          />
          <Route
            path={AppRoutes.VENDOR_ADD_PRODUCTS}
            element={<VendorAddProduct />}
          />
          <Route
            path={AppRoutes.VENDOR_EDIT_PRODUCT}
            element={<VendorEditProduct />}
          />
          <Route path={AppRoutes.VENDOR_ORDERS} element={<VendorOrders />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
