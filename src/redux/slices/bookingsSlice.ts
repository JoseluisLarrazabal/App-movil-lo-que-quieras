import { createSlice, type PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../services/api"

export interface Booking {
  id: string
  serviceId: string
  providerId: string
  userId: string
  date: string
  time: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  price: number
  notes?: string
  service: {
    title: string
    image: string
  }
  provider: {
    name: string
    avatar: string
  }
  user: {
    name: string
    avatar: string
  }
}

interface BookingsState {
  items: Booking[]
  userBookings: Booking[]
  providerBookings: Booking[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

// Thunk para obtener reservas del usuario
export const fetchUserBookings = createAsyncThunk<
  Booking[],
  string, // userId
  { rejectValue: { message: string; data?: any } }
>(
  "bookings/fetchUserBookings",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/bookings/user/${userId}`)
      return res.data.bookings
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || "Error al cargar reservas del usuario",
        data: error.response?.data
      })
    }
  }
)

// Thunk para obtener reservas del proveedor
export const fetchProviderBookings = createAsyncThunk<
  Booking[],
  string, // providerId
  { rejectValue: { message: string; data?: any } }
>(
  "bookings/fetchProviderBookings",
  async (providerId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/bookings/provider/${providerId}`)
      return res.data.bookings
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || "Error al cargar reservas del proveedor",
        data: error.response?.data
      })
    }
  }
)

// Thunk para crear una reserva
export const createBooking = createAsyncThunk<
  any, // Puedes tipar la respuesta si lo deseas
  {
    serviceId: string
    scheduledDate: string
    scheduledTime: string
    notes?: string
    address?: string
  },
  { rejectValue: { message: string; data?: any } }
>(
  "bookings/createBooking",
  async (bookingData, { rejectWithValue }) => {
    try {
      const res = await api.post("/bookings", bookingData)
      return res.data.booking
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || "Error al crear reserva",
        data: error.response?.data
      })
    }
  }
)

const initialState: BookingsState = {
  items: [],
  userBookings: [],
  providerBookings: [],
  status: "idle",
  error: null,
}

const bookingsSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    addBooking: (state, action: PayloadAction<Booking>) => {
      state.items.push(action.payload)
      state.userBookings.push(action.payload)
    },
    updateBookingStatus: (state, action: PayloadAction<{ id: string; status: Booking["status"] }>) => {
      const booking = state.items.find((b) => b.id === action.payload.id)
      if (booking) {
        booking.status = action.payload.status
      }
    },
    setUserBookings: (state, action: PayloadAction<Booking[]>) => {
      state.userBookings = action.payload
    },
    setProviderBookings: (state, action: PayloadAction<Booking[]>) => {
      state.providerBookings = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserBookings.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.userBookings = action.payload
        state.error = null
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload?.message || "Error desconocido"
      })
      .addCase(fetchProviderBookings.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchProviderBookings.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.providerBookings = action.payload
        state.error = null
      })
      .addCase(fetchProviderBookings.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload?.message || "Error desconocido"
      })
      .addCase(createBooking.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.userBookings.unshift(action.payload)
        state.error = null
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload?.message || "Error desconocido"
      })
  }
})

export const { addBooking, updateBookingStatus, setUserBookings, setProviderBookings } = bookingsSlice.actions
export default bookingsSlice.reducer
