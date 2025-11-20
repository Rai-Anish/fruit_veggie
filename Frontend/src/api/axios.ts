// src/api/axios.ts
import axios from 'axios'
import { store } from '@/store/store'
import {
  setAccessToken,
  clearAccessToken,
} from '@/features/auth/store/tokenSlice'
import { clearUserInfo, setUserInfo } from '@/features/auth/store/userSlice'
import { AppRoutes } from '@/router/route' // For redirection

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
})

axiosClient.interceptors.request.use(
  (config) => {
    const state = store.getState()
    const accessToken = state.token.accessToken

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/refresh-token`,
          {},
          { withCredentials: true }
        )

        const newAccessToken = response.data.data.accessToken
        const newUserInfo = response.data.data.user

        store.dispatch(setAccessToken(newAccessToken))
        store.dispatch(setUserInfo(newUserInfo))

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        return axiosClient(originalRequest)
      } catch (refreshError: any) {
        console.error('Failed to refresh token:', refreshError)
        store.dispatch(clearAccessToken(null))
        store.dispatch(clearUserInfo(null))
        window.location.href = AppRoutes.LOGIN
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

export default axiosClient
