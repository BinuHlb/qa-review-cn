import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from './slices/authSlice'
import { reviewsSlice } from './slices/reviewsSlice'
import { uiSlice } from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    reviews: reviewsSlice.reducer,
    ui: uiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
