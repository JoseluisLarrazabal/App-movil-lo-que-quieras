import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../services/api"

export interface Category {
  _id: string
  name: string
  description: string
  icon: string
  color: string
  isActive: boolean
  serviceCount?: number
  featured?: boolean
  order?: number
}

interface CategoriesState {
  items: Category[]
  selectedCategory: Category | null
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

// Thunk para cargar categorías
export const fetchCategories = createAsyncThunk<
  Category[],
  void,
  { rejectValue: { message: string; data?: any } }
>(
  "categories/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      console.log("🔍 Fetching categories from API...")
      const res = await api.get("/categories")
      console.log("📦 Categories Response:", res.data)
      return res.data.categories
    } catch (error: any) {
      console.log("❌ Error fetching categories:", error)
      return rejectWithValue({
        message: error.response?.data?.message || "Error al cargar categorías",
        data: error.response?.data
      })
    }
  }
)

const initialState: CategoriesState = {
  items: [],
  selectedCategory: null,
  status: "idle",
  error: null
}

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.items = action.payload
    },
    setSelectedCategory: (state, action: PayloadAction<Category | null>) => {
      state.selectedCategory = action.payload
    },
    setStatus: (state, action: PayloadAction<CategoriesState['status']>) => {
      state.status = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        console.log("✅ Categories loaded into state:", action.payload?.length || 0)
        state.status = "succeeded"
        state.error = null
        state.items = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload?.message || "Error desconocido"
      })
  }
})

export const {
  setCategories,
  setSelectedCategory,
  setStatus,
  setError
} = categoriesSlice.actions

export default categoriesSlice.reducer
