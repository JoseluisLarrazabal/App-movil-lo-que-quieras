// redux/store.ts
import { configureStore } from "@reduxjs/toolkit"
import servicesReducer from "./slices/servicesSlice"
import categoriesReducer from "./slices/categoriesSlice"
import bookingsReducer from "./slices/bookingsSlice"
import searchHistoryReducer from "./slices/searchHistorySlice"
import professionalsReducer from "./slices/professionalsSlice"
import usersReducer from "./slices/usersSlice"
import healthFacilitiesReducer from "./slices/healthFacilitiesSlice"
import localStoresReducer from "./slices/localStoresSlice"

export const store = configureStore({
  reducer: {
    services: servicesReducer,
    categories: categoriesReducer,
    bookings: bookingsReducer,
    searchHistory: searchHistoryReducer,
    professionals: professionalsReducer, 
    users: usersReducer,
    healthFacilities: healthFacilitiesReducer,
    localStores: localStoresReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch