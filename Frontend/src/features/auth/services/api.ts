import axiosClient from '../../../api/axios'

interface Credentials {
  email: string
  password: string
}

interface RegisterPayload extends Credentials {
  fullName: string
}

interface ResetPasswordPayload {
  token: string
  newPassword: string
}

export const AuthAPI = {
  login: async (credentials: Credentials) => {
    const response = await axiosClient.post('/api/v1/auth/login', credentials)
    return response.data
  },
  signUp: async (data: RegisterPayload) => {
    const response = await axiosClient.post('/api/v1/auth/signup', data)
    return response.data
  },
  logout: async () => {
    const response = await axiosClient.get('/api/v1/auth/logout')
    return response.data
  },
  resendVerificationEmail: async () => {
    const response = await axiosClient.post('/api/v1/auth/resend-verifyemail')
    return response.data
  },
  //////////////////////////////////////////////////////////
  forgotPassword: async (email: string) => {
    const response = await axiosClient.post('/api/v1/auth/login', email)
    return response.data
  },
  resetPassword: async (payload: ResetPasswordPayload) => {
    const response = await axiosClient.post('/api/v1/auth/login', payload)
    return response.data
  },
  verifyEmail: async (token: string) => {
    const response = await axiosClient.post(
      `/api/v1/auth/verify-email/${token}`
    )
    return response.data
  },
  accessToken: async () => {
    const response = await axiosClient.post('/api/v1/auth/refresh-token')
    return response.data
  },
}
