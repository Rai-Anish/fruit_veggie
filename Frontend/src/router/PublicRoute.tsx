// src/router/PublicRoute.tsx

import { Navigate, Outlet, useLocation } from 'react-router-dom' // Import useLocation
import { useAppSelector } from '../store/hooks'
import { getDefaultDashboardRoute } from './route' // Ensure AppRoutes is imported
import {
  selectAccessToken,
  selectUserRole,
} from '../features/auth/store/selectors'

const PublicRoute = () => {
  const accessToken = useAppSelector(selectAccessToken)
  const userRole = useAppSelector(selectUserRole)
  const location = useLocation() // Get the current location

  const isAuthenticated = !!accessToken

  if (isAuthenticated) {
    const redirectPath = getDefaultDashboardRoute(userRole) // This is '/' for customer

    // *** NEW LOGIC HERE ***
    // If the user is authenticated AND they are already at their intended redirectPath,
    // then *do not redirect again*. Just let the Outlet render.
    if (location.pathname === redirectPath) {
      return <Outlet />
    }

    // Otherwise, if they are authenticated but on a different public route
    // (like /login or /signup), redirect them to their default dashboard.
    return <Navigate to={redirectPath} replace />
  }

  // If not authenticated, render the children (e.g., LoginPage, SignupPage)
  return <Outlet />
}

export default PublicRoute
