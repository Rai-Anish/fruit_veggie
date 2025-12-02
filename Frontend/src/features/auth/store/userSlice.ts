import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface UserInfo {
  _id: string
  fullName: string
  email: string
  role: 'customer' | 'vendor' | 'admin'
  lastLogin: string
}

type UserState = UserInfo | null

const userSlice = createSlice({
  name: 'user',
  initialState: null as UserState,
  reducers: {
    setUserInfo: (_, action: PayloadAction<UserInfo>) => action.payload,
    clearUserInfo: () => null,
  },
})

export const { setUserInfo, clearUserInfo } = userSlice.actions
export default userSlice.reducer
