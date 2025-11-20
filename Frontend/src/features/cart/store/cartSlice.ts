import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface cartItem {
  id: string
  name: string
  price: number
  quantity: number
}

const initialState: cartItem[] = []

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<cartItem>) => {
      state.push(action.payload)
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      return state.filter((item) => item.id !== action.payload)
    },
    clearCart: () => [],
  },
})

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions
export default cartSlice.reducer
