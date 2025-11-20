import type { RootState } from '../../../store/store'
import type { UserInfo } from './userSlice'

export const selectUser = (state: RootState) => state.user
export const selectAccessToken = (state: RootState) => state.token.accessToken
export const selectUserRole = (
  state: RootState
): UserInfo['role'] | undefined => state.user?.role
