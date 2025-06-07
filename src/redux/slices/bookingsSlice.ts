import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

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

const mockBookings: Booking[] = [
  {
    id: "1",
    serviceId: "1",
    providerId: "1",
    userId: "3",
    date: "2024-01-15",
    time: "14:00",
    status: "confirmed",
    price: 850,
    notes: "Limpieza completa de 3 habitaciones",
    service: {
      title: "Limpieza profunda de hogar",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
    },
    provider: {
      name: "María García",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    user: {
      name: "María Usuario",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    },
  },
]

const initialState: BookingsState = {
  items: mockBookings,
  userBookings: mockBookings,
  providerBookings: mockBookings,
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
})

export const { addBooking, updateBookingStatus, setUserBookings, setProviderBookings } = bookingsSlice.actions
export default bookingsSlice.reducer
