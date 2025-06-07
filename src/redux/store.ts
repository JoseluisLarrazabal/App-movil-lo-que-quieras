import { configureStore } from "@reduxjs/toolkit"
import servicesReducer from "./slices/servicesSlice"
import categoriesReducer from "./slices/categoriesSlice"
import bookingsReducer from "./slices/bookingsSlice"
import searchHistoryReducer from "./slices/searchHistorySlice"

export const store = configureStore({
  reducer: {
    services: servicesReducer,
    categories: categoriesReducer,
    bookings: bookingsReducer,
    searchHistory: searchHistoryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
