import axiosClient from '@/api/axios'
import { Button } from '@/components/ui/button'
import { selectUser } from '@/features/auth/store/selectors'
import { clearAccessToken } from '@/features/auth/store/tokenSlice'
import { clearUserInfo } from '@/features/auth/store/userSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import React from 'react'

type Props = {}

const HomePage = (props: Props) => {
  const user = useAppSelector(selectUser)
  const dispatch = useAppDispatch()

  const logoutHandler = async () => {
    await axiosClient.get('/api/v1/auth/logout')
    dispatch(clearUserInfo(null))
    dispatch(clearAccessToken())
  }
  return (
    <div>
      <div>name: {user?._id}</div>
      <div>name: {user?.fullName}</div>
      <div>role: {user?.role}</div>
      <div>email: {user?.email}</div>
      <div>name: {user?.lastLogin}</div>
      hello
      {user && <Button onClick={() => logoutHandler()}>Logout</Button>}
    </div>
  )
}

export default HomePage
