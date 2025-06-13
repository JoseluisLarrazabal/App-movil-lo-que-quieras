// redux/slices/professionalsSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../services/api"

export interface Professional {
  _id: string
  user: { 
    _id: string
    name: string
    avatar: string 
  }
  userInfo?: {
    name: string
    avatar: string
  }
  profession: string
  specialties: string[]
  experience: { 
    years: number
    description?: string
  }
  rating: number
  reviewsCount: number
  projectsCompleted: number
  rates: {
    hourly?: number
    daily?: number
    project?: string
  }
  workLocation: {
    city: string
    address?: string
    coordinates?: {
      lat: number
      lng: number
    }
    radius?: number
  }
  availability: {
    type: 'full-time' | 'part-time' | 'freelance' | 'contract'
    schedule?: {
      days: string[]
      hours: {
        start: string
        end: string
      }
    }
    remote: boolean
  }
  contactInfo: {
    phone: string
    whatsapp?: string
    email?: string
  }
  skills: string[]
  portfolio?: any[]
  verified: boolean
  isActive: boolean
  responseTime: string
}

interface ProfessionalsState {
  items: Professional[]
  searchResults: Professional[]
  selectedProfessional: Professional | null
  filters: {
    profession: string
    availability: string
    location: string
    minRating: number
    maxRate: number
  }
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

// ----------- THUNK ASYNC -----------
export const fetchProfessionals = createAsyncThunk<
  Professional[],
  void,
  { rejectValue: { message: string; data?: any } }
>(
  "professionals/fetchProfessionals",
  async (_, { rejectWithValue }) => {
    try {
      console.log("🔍 Fetching professionals from API...")
      const res = await api.get("/professionals/search")
      console.log("📦 API Response:", res.data)
      console.log("👥 Professionals found:", res.data.professionals?.length || 0)
      return res.data.professionals
    } catch (error: any) {
      console.log("❌ Error fetching professionals:", error)
      return rejectWithValue({
        message: error.response?.data?.message || "Error al cargar profesionales",
        data: error.response?.data
      })
    }
  }
)

export const createProfessionalProfile = createAsyncThunk<
  Professional,
  Partial<Professional>,
  { rejectValue: { message: string; data?: any } }
>(
  "professionals/createProfessionalProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const res = await api.post("/professionals/profile", profileData)
      return res.data.professional
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || "Error al crear perfil profesional",
        data: error.response?.data
      })
    }
  }
)

// ----------- ESTADO INICIAL -----------
const initialState: ProfessionalsState = {
  items: [
    // Mock data para testing (comentado para usar datos reales de la API)
    /*
    {
      _id: "1",
      user: {
        _id: "1",
        name: "Carlos Mendoza",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg"
      },
      profession: "Soldador",
      specialties: ["Soldadura TIG", "Soldadura MIG", "Soldadura por arco"],
      experience: {
        years: 8,
        description: "Especialista en soldadura industrial con certificaciones internacionales"
      },
      rating: 4.9,
      reviewsCount: 45,
      projectsCompleted: 120,
      rates: {
        hourly: 1500,
        daily: 12000
      },
      workLocation: {
        city: "Buenos Aires",
        address: "CABA",
        radius: 50
      },
      availability: {
        type: "freelance",
        remote: false
      },
      contactInfo: {
        phone: "+54 11 1234-5678",
        whatsapp: "+54 11 1234-5678"
      },
      skills: ["Soldadura", "Lectura de planos", "Seguridad industrial"],
      verified: true,
      isActive: true,
      responseTime: "< 2 horas"
    },
    {
      _id: "2",
      user: {
        _id: "2",
        name: "Dr. Ana García",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg"
      },
      profession: "Médico",
      specialties: ["Medicina General", "Consultas domiciliarias"],
      experience: {
        years: 12,
        description: "Médica especialista en medicina general con consultas a domicilio"
      },
      rating: 4.8,
      reviewsCount: 89,
      projectsCompleted: 200,
      rates: {
        hourly: 2500
      },
      workLocation: {
        city: "Buenos Aires",
        radius: 30
      },
      availability: {
        type: "part-time",
        remote: false
      },
      contactInfo: {
        phone: "+54 11 9876-5432",
        whatsapp: "+54 11 9876-5432"
      },
      skills: ["Medicina general", "Primeros auxilios", "Consultas domiciliarias"],
      verified: true,
      isActive: true,
      responseTime: "< 4 horas"
    },
    {
      _id: "3",
      user: {
        _id: "3",
        name: "Roberto Silva",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg"
      },
      profession: "Albañil",
      specialties: ["Construcción", "Reformas", "Reparaciones"],
      experience: {
        years: 15,
        description: "Maestro albañil con amplia experiencia en construcción y reformas"
      },
      rating: 4.7,
      reviewsCount: 67,
      projectsCompleted: 85,
      rates: {
        daily: 8000,
        project: "Según proyecto"
      },
      workLocation: {
        city: "Buenos Aires",
        radius: 40
      },
      availability: {
        type: "full-time",
        remote: false
      },
      contactInfo: {
        phone: "+54 11 5555-7777"
      },
      skills: ["Albañilería", "Reformas", "Pintura", "Plomería básica"],
      verified: false,
      isActive: true,
      responseTime: "< 24 horas"
    }
    */
  ],
  searchResults: [],
  selectedProfessional: null,
  filters: {
    profession: "",
    availability: "",
    location: "",
    minRating: 0,
    maxRate: 0
  },
  status: "idle",
  error: null
}

const professionalsSlice = createSlice({
  name: "professionals",
  initialState,
  reducers: {
    setProfessionals: (state, action: PayloadAction<Professional[]>) => {
      state.items = action.payload
    },
    setSearchResults: (state, action: PayloadAction<Professional[]>) => {
      state.searchResults = action.payload
    },
    setSelectedProfessional: (state, action: PayloadAction<Professional | null>) => {
      state.selectedProfessional = action.payload
    },
    setFilters: (state, action: PayloadAction<Partial<ProfessionalsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    setStatus: (state, action: PayloadAction<ProfessionalsState['status']>) => {
      state.status = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    addProfessional: (state, action: PayloadAction<Professional>) => {
      // Remover cualquier perfil previo del mismo usuario antes de agregar el nuevo
      state.items = state.items.filter(p => p.user._id !== action.payload.user._id)
      // Asegurar que el profesional tenga un ID único
      const newProfessional = {
        ...action.payload,
        _id: action.payload._id || `professional_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
      state.items.push(newProfessional)
    },
    updateProfessional: (state, action: PayloadAction<Professional>) => {
      const index = state.items.findIndex(p => p._id === action.payload._id)
      if (index !== -1) {
        state.items[index] = action.payload
      }
    },
    deleteProfessional: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(p => p._id !== action.payload)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfessionals.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchProfessionals.fulfilled, (state, action) => {
        console.log("✅ Professionals loaded into state:", action.payload?.length || 0)
        state.status = "succeeded"
        state.error = null
        state.items = action.payload
      })
      .addCase(fetchProfessionals.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload?.message || "Error desconocido"
      })
      .addCase(createProfessionalProfile.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(createProfessionalProfile.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.error = null
        // Remover cualquier perfil previo del mismo usuario antes de agregar el nuevo
        state.items = state.items.filter(p => p.user._id !== action.payload.user._id)
        // Asegurar que el profesional tenga un ID único
        const newProfessional = {
          ...action.payload,
          _id: action.payload._id || `professional_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }
        state.items.push(newProfessional)
      })
      .addCase(createProfessionalProfile.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload?.message || "Error desconocido"
      })
  }
})

// ----------- EXPORTS -----------
export const {
  setProfessionals,
  setSearchResults,
  setSelectedProfessional,
  setFilters,
  setStatus,
  setError,
  addProfessional,
  updateProfessional,
  deleteProfessional
} = professionalsSlice.actions

export default professionalsSlice.reducer