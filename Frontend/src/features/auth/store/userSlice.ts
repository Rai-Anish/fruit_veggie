import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface UserInfo {
  _id: string
  fullName: string
  email: string
  role: 'customer' | 'vendor' | 'admin'
  lastLogin: string
}

const initialState: UserInfo | null = null

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfo>): UserInfo =>
      action.payload,
    clearUserInfo: () => null,
  },
})

export const { setUserInfo, clearUserInfo } = userSlice.actions
export default userSlice.reducer
