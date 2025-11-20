import { useMutation } from '@tanstack/react-query'
import { AuthAPI } from '../services/api'
import { useNavigate } from 'react-router-dom'
import { AppRoutes } from '../../../router/route'
import { toast } from 'sonner'

export function useSignup() {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: AuthAPI.signUp,
    onSuccess: () => {
      navigate(AppRoutes.VERIFY_EMAIL_NOTICE, { replace: true })
    },
    onError: (error: any) => {
      let errorMessage = 'Sign up failed'

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }

      toast.error('Sign up failed.', {
        description: errorMessage,
      })
    },
  })
}
