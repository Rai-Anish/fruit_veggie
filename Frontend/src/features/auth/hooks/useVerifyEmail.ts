// src/features/auth/hooks/useAuthMutations.ts
import { useMutation } from '@tanstack/react-query'
import { AuthAPI } from '../services/api'
import { useAppDispatch } from '../../../store/hooks'
import { setUserInfo } from '../store/userSlice'
import { setAccessToken } from '../store/tokenSlice'

interface data {
  user: {
    id: string
    email: string
    fullName: string
    role: 'customer' | 'vendor' | 'admin'
    lastLogin: string
  }
  accessToken: string
}

interface BackendResponse {
  statusCode: number
  message: string
  data: data
  success: boolean
}

export function useVerifyEmail() {
  const dispatch = useAppDispatch()
  return useMutation({
    mutationFn: AuthAPI.verifyEmail,
    onSuccess: (backendResponse: BackendResponse) => {
      const { user, accessToken } = backendResponse.data

      dispatch(setUserInfo(user))
      dispatch(setAccessToken(accessToken))
    },
  })
}
