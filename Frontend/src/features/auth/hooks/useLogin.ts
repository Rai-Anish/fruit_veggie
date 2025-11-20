import { useMutation } from '@tanstack/react-query'
import { AuthAPI } from '../services/api'
import { useAppDispatch } from '../../../store/hooks'
import { setUserInfo } from '../store/userSlice'
import { setAccessToken } from '../store/tokenSlice'
import { useNavigate } from 'react-router-dom'
import { getDefaultDashboardRoute } from '../../../router/route'
import { toast } from 'sonner'

interface data {
  user: {
    _id: string
    email: string
    fullName: string
    role: 'customer' | 'vendor' | 'admin'
    lastLogin: string
  }
  refreshToken: string
  accessToken: string
}

interface BackendResponse {
  statusCode: number
  message: string
  data: data
  success: boolean
}

export function useLogin() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: AuthAPI.login,
    onSuccess: (backendResponse: BackendResponse) => {
      const { user, accessToken } = backendResponse.data

      dispatch(setUserInfo(user))
      dispatch(setAccessToken(accessToken))

      toast.success('Welcome back', {
        description: backendResponse.message,
      })

      const redirectPath = getDefaultDashboardRoute(user.role)
      navigate(redirectPath, { replace: true })
    },
    onError: (error: any) => {
      let errorMessage = 'Login failed. Please try again.'

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }

      toast.error('Login Failed', {
        description: errorMessage,
      })
    },
  })
}
