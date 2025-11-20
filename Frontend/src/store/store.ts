import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import cartReducer from '../features/cart/store/cartSlice'
import userReducer from '../features/auth/store/userSlice'
import tokenReducer from '../features/auth/store/tokenSlice'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart', 'user'],
}

const rootReducer = combineReducers({
  cart: cartReducer,
  user: userReducer,
  token: tokenReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  devTools: import.meta.env.DEV,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
