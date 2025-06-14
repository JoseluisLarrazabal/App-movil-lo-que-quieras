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

// Thunk para crear categoría
export const createCategory = createAsyncThunk<
  Category,
  { name: string; description?: string; icon: string; color: string },
  { rejectValue: { message: string; data?: any } }
>(
  "categories/createCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const res = await api.post("/categories", categoryData)
      return res.data.category
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || "Error al crear categoría",
        data: error.response?.data
      })
    }
  }
)

// Thunk para actualizar categoría
export const updateCategory = createAsyncThunk<
  Category,
  { id: string; data: Partial<Category> },
  { rejectValue: { message: string; data?: any } }
>(
  "categories/updateCategory",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/categories/${id}`, data)
      return res.data.category
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || "Error al actualizar categoría",
        data: error.response?.data
      })
    }
  }
)

// Thunk para eliminar categoría (soft delete)
export const deleteCategory = createAsyncThunk<
  string,
  string,
  { rejectValue: { message: string; data?: any } }
>(
  "categories/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/categories/${id}`)
      return id
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || "Error al eliminar categoría",
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
      // Crear categoría
      .addCase(createCategory.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.items.push(action.payload)
        state.error = null
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload?.message || "Error desconocido"
      })
      // Actualizar categoría
      .addCase(updateCategory.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.status = "succeeded"
        const idx = state.items.findIndex(cat => cat._id === action.payload._id)
        if (idx !== -1) state.items[idx] = action.payload
        state.error = null
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload?.message || "Error desconocido"
      })
      // Eliminar categoría
      .addCase(deleteCategory.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.items = state.items.filter(cat => cat._id !== action.payload)
        state.error = null
      })
      .addCase(deleteCategory.rejected, (state, action) => {
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
