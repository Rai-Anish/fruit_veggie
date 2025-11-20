import { useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { setAccessToken } from '../store/tokenSlice'
import { setUserInfo } from '../store/userSlice'
import { AuthAPI } from '../services/api'

interface data {
  accessToken: string
}

interface BackendResponse {
  statusCode: number
  message: string
  data: data
  success: boolean
}

const useAuthCheck = () => {
  const dispatch = useDispatch()

  const refreshMutation = useMutation({
    mutationFn: AuthAPI.accessToken,

    onSuccess: (backendResponse: BackendResponse) => {
      const { accessToken } = backendResponse.data
      dispatch(setAccessToken(accessToken))
    },
    onError: (error) => {
      console.error('Failed to refresh token on app load:', error)
      dispatch(setAccessToken(null))
      dispatch(setUserInfo(null))
    },
  })

  useEffect(() => {
    refreshMutation.mutate()
  }, [])

  return { isLoading: refreshMutation.isPending }
}

export default useAuthCheck
