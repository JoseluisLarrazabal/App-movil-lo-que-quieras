import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

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

const mockServices: Service[] = [
  {
    id: "1",
    title: "Limpieza profunda de hogar",
    description: "Servicio completo de limpieza para tu hogar, incluye todas las habitaciones",
    price: 850,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
    category: { id: "1", name: "Limpieza" },
    provider: {
      id: "1",
      name: "María García",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 4.9,
    },
    location: {
      lat: -34.6037,
      lng: -58.3816,
      address: "Buenos Aires, Argentina",
    },
  },
  {
    id: "2",
    title: "Reparación de tuberías",
    description: "Solución rápida y eficiente para problemas de plomería",
    price: 1200,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400",
    category: { id: "2", name: "Plomería" },
    provider: {
      id: "2",
      name: "Juan Pérez",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 4.7,
    },
    location: {
      lat: -34.6037,
      lng: -58.3816,
      address: "Buenos Aires, Argentina",
    },
  },
  {
    id: "3",
    title: "Instalación eléctrica",
    description: "Instalación y reparación de sistemas eléctricos residenciales",
    price: 950,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400",
    category: { id: "3", name: "Electricidad" },
    provider: {
      id: "3",
      name: "Carlos López",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      rating: 4.8,
    },
    location: {
      lat: -34.6037,
      lng: -58.3816,
      address: "Buenos Aires, Argentina",
    },
  },
]

const initialState: ServicesState = {
  items: mockServices,
  popularServices: mockServices,
  nearbyServices: mockServices,
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
})

export const { setSelectedService, addService, updateService, deleteService } = servicesSlice.actions
export default servicesSlice.reducer
