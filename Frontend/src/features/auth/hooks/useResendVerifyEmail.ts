// src/features/auth/hooks/useAuthMutations.ts
import { useMutation } from '@tanstack/react-query'
import { AuthAPI } from '../services/api'
import { toast } from 'sonner'

interface data {
  signUpToken: string
}

interface BackendResponse {
  statusCode: number
  message: string
  data: data
  success: boolean
}

export function useResendVerifyEmail() {
  return useMutation({
    mutationFn: AuthAPI.resendVerificationEmail,
    onSuccess: (backendResponse: BackendResponse) => {
      toast.success('Email send successfully', {
        description: backendResponse.message,
      })
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
      toast.success('Error sending email', {
        description: errorMessage,
      })
    },
  })
}
