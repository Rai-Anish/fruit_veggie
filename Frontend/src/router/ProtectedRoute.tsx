import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'
import { AppRoutes, getDefaultDashboardRoute } from './route'
import {
  selectAccessToken,
  selectUserRole,
} from '../features/auth/store/selectors'

interface ProtectedRouteProps {
  allowedRoles?: ('admin' | 'vendor' | 'customer')[]
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const userRole = useAppSelector(selectUserRole)
  const accessToken = useAppSelector(selectAccessToken)
  const isAuthenticated = !!accessToken

  if (!isAuthenticated) {
    return <Navigate to={AppRoutes.LOGIN} replace />
  }

  // Check Role-Based Authorization (if `allowedRoles` are specified)
  if (allowedRoles && userRole) {
    if (!allowedRoles.includes(userRole)) {
      // Redirect to their default dashboard
      return <Navigate to={getDefaultDashboardRoute(userRole)} replace />
    }
  }

  // If authenticated and authorized, render the child routes
  return <Outlet />
}

export default ProtectedRoute
