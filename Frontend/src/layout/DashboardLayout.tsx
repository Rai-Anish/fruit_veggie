import React from 'react'
import { Outlet } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'
import { selectUser } from '../features/auth/store/selectors'

const DashboardLayout = () => {
  const user = useAppSelector(selectUser)
  return (
    <div>
      <p>{user?.userName}</p>
      <p>{user?.role}</p>
      <p>{user?.email}</p>
      <div>
        <Outlet />
      </div>
    </div>
  )
}

export default DashboardLayout
