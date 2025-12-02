import { useMutation } from '@tanstack/react-query'
import { AuthAPI } from '../services/api'
import { useAppDispatch } from '../../../store/hooks'
import { clearUserInfo } from '../store/userSlice'
import { clearAccessToken } from '../store/tokenSlice'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

export function useLogout() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: AuthAPI.logout,
    onSuccess: () => {
      // Clear Redux
      dispatch(clearUserInfo())
      dispatch(clearAccessToken())

      toast.success('Logged out successfully')

      // Redirect user
      // navigate('/login', { replace: true })
    },
    onError: (error: any) => {
      toast.error('Logout failed', {
        description: error?.response?.data?.message || error.message,
      })
    },
  })
}
