import { createSlice, type PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../services/api"

export interface Service {
  id: string
  title: string
  description: string
  price: number
  rating: number
  image: string
  category: {
    id: string
    name: string
  }
  provider: {
    id: string
    name: string
    avatar: string
    rating: number
  }
  location: {
    lat: number
    lng: number
    address: string
  }
}

interface ServicesState {
  items: Service[]
  popularServices: Service[]
  nearbyServices: Service[]
  selectedService: Service | null
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

// Thunk para obtener servicios reales
export const fetchServices = createAsyncThunk<
  Service[],
  void,
  { rejectValue: { message: string; data?: any } }
>(
  "services/fetchServices",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/services")
      // Mapear los servicios para que coincidan con la interfaz del frontend
      return res.data.services.map((s: any) => ({
        id: s._id,
        title: s.title,
        description: s.description,
        price: s.price,
        rating: s.rating || 0,
        image: s.images?.[0] || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
        category: {
          id: s.category?._id || s.category?.id || "",
          name: s.category?.name || ""
        },
        provider: {
          id: s.provider?._id || s.provider?.id || "",
          name: s.provider?.name || "",
          avatar: s.provider?.avatar || "https://randomuser.me/api/portraits/men/32.jpg",
          rating: s.provider?.rating || 0
        },
        location: {
          lat: s.location?.lat || 0,
          lng: s.location?.lng || 0,
          address: s.location?.address || ""
        }
      }))
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || "Error al cargar servicios",
        data: error.response?.data
      })
    }
  }
)

const initialState: ServicesState = {
  items: [],
  popularServices: [],
  nearbyServices: [],
  selectedService: null,
  status: "idle",
  error: null,
}

const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    setSelectedService: (state, action: PayloadAction<Service | null>) => {
      state.selectedService = action.payload
    },
    addService: (state, action: PayloadAction<Service>) => {
      state.items.push(action.payload)
    },
    updateService: (state, action: PayloadAction<Service>) => {
      const index = state.items.findIndex((service) => service.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = action.payload
      }
    },
    deleteService: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((service) => service.id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.items = action.payload
        state.popularServices = action.payload.slice(0, 4)
        state.error = null
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload?.message || "Error desconocido"
      })
  }
})

export const { setSelectedService, addService, updateService, deleteService } = servicesSlice.actions
export default servicesSlice.reducer
