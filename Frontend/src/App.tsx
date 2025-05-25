// src/App.tsx
import { Routes, Route } from 'react-router-dom'
import { AppRoutes } from './router/route'
// import ProtectedRoute from './router/ProtectedRoute';

// // --- Layout Imports ---
// import CustomerLayout from './layout/CustomerLayout';
// import VendorLayout from './layout/VendorLayout';
// import AdminLayout from './layout/AdminLayout';

// // --- Page Imports (features/auth/pages) ---
import LoginPage from './features/auth/pages/LoginPage'
// import SignupPage from './features/auth/pages/SignupPage';
// import ForgotPasswordPage from './features/auth/pages/ForgotPasswordPage';

// // --- Page Imports (features/customer/pages) ---
// import CustomerHomePage from './features/customer/pages/HomePage'; // Public homepage
// import CustomerProductDetailPage from './features/customer/pages/ProductDetailPage'; // Public product detail
// import CartPage from './features/customer/pages/CartPage';
// import CheckoutPage from './features/customer/pages/CheckoutPage';
// import OrderHistoryPage from './features/customer/pages/OrderHistoryPage';
// import CustomerProfilePage from './features/customer/pages/CustomerProfilePage';

// // --- Page Imports (features/vendor/pages) ---
// import VendorDashboardPage from './features/vendor/pages/VendorDashboardPage';
// import VendorProductsPage from './features/vendor/pages/VendorProductsPage';
// import AddProductPage from './features/vendor/pages/AddProductPage';
// import EditProductPage from './features/vendor/pages/EditProductPage';
// import VendorOrdersPage from './features/vendor/pages/VendorOrdersPage';
// import VendorSalesPage from './features/vendor/pages/VendorSalesPage';
// import VendorProfileSettingsPage from './features/vendor/pages/VendorProfileSettingsPage';

// // --- Page Imports (features/admin/pages) ---
// import AdminDashboardPage from './features/admin/pages/AdminDashboardPage';
// import AdminUserManagementPage from './features/admin/pages/UserManagementPage';
// import AdminUserDetailPage from './features/admin/pages/UserDetailPage';
// import AdminVendorVerificationPage from './features/admin/pages/VendorVerificationPage';
// import AdminCategoryManagementPage from './features/admin/pages/CategoryManagementPage';
// import AdminOrderManagementPage from './features/admin/pages/OrderManagementPage';
// import AdminSettingsPage from './features/admin/pages/SettingsPage';

// // --- Generic/Error Pages ---
// import NotFoundPage from './pages/NotFoundPage'; // Or src/common/pages/NotFoundPage.tsx
// import UnauthorizedPage from './pages/UnauthorizedPage'; // Or src/common/pages/UnauthorizedPage.tsx

function App() {
  return (
    <Routes>
      {/* --- Public & Authentication Routes --- */}
      <Route path={AppRoutes.LOGIN} element={<LoginPage />} />
    </Routes>
  )
}

export default App
