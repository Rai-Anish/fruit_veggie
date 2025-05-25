// src/router/ProtectedRoute.tsx
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../store/hooks' // From src/store/hooks.ts
import {
  selectIsAuthenticated,
  selectUserRole,
  selectAuthLoading,
} from '../features/auth/store/authSlice' // From auth slice
import { AppRoutes, getDefaultDashboardRoute } from './routes' // Import your route definitions
import { Center, Loader, Text } from '@mantine/core' // Mantine loading components

interface ProtectedRouteProps {
  // Roles allowed to access the nested routes.
  // If not provided, it means just authenticated access is required.
  allowedRoles?: ('admin' | 'vendor' | 'customer')[]
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const userRole = useAppSelector(selectUserRole)
  const isLoadingAuth = useAppSelector(selectAuthLoading) // Initial auth check loading

  // 1. Handle Initial Loading State (e.g., checking localStorage for token)
  // This prevents flickering to login page while auth state is being determined.
  if (isLoadingAuth) {
    return (
      <Center style={{ minHeight: '100vh' }}>
        <Loader size="xl" />
        <Text ml="md">Loading authentication data...</Text>
      </Center>
    )
  }

  // 2. Check Authentication Status
  if (!isAuthenticated) {
    // Not authenticated, redirect to login
    return <Navigate to={AppRoutes.LOGIN} replace />
  }

  // 3. Check Role-Based Authorization (if `allowedRoles` are specified)
  if (allowedRoles && userRole) {
    if (!allowedRoles.includes(userRole)) {
      // Authenticated but not authorized for this specific route
      console.warn(
        `Access Denied: User role '${userRole}' is not authorized for this route.`
      )
      // Redirect to their default dashboard or a generic unauthorized page
      return <Navigate to={getDefaultDashboardRoute(userRole)} replace />
    }
  }

  // 4. If authenticated and authorized, render the child routes
  // The <Outlet /> component renders the child route that matches.
  return <Outlet />
}

export default ProtectedRoute
