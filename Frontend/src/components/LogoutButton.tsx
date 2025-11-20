import axiosClient from '@/api/axios'
import { clearAccessToken } from '@/features/auth/store/tokenSlice'
import { clearUserInfo } from '@/features/auth/store/userSlice'
import { useAppDispatch } from '@/store/hooks'

const LogoutButton = ({ text }: { text: string }) => {
  const dispatch = useAppDispatch()

  const logoutHandler = async () => {
    await axiosClient.get('/api/v1/auth/logout')
    dispatch(clearUserInfo(null))
    dispatch(clearAccessToken())
  }
  return (
    <div className="hover:cursor-pointer" onClick={logoutHandler}>
      {text}
    </div>
  )
}

export default LogoutButton
