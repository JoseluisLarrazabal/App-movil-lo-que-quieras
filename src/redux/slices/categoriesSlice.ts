import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Category {
  id: string
  name: string
  icon: string
  color: string
  serviceCount: number
}

interface CategoriesState {
  items: Category[]
  featuredCategories: Category[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: CategoriesState = {
  items: [
    { id: "1", name: "Limpieza", icon: "🧹", color: "#E3F2FD", serviceCount: 45 },
    { id: "2", name: "Plomería", icon: "🔧", color: "#F3E5F5", serviceCount: 32 },
    { id: "3", name: "Electricidad", icon: "⚡", color: "#E8F5E8", serviceCount: 28 },
    { id: "4", name: "Jardinería", icon: "🌱", color: "#FFF3E0", serviceCount: 19 },
    { id: "5", name: "Pintura", icon: "🎨", color: "#FCE4EC", serviceCount: 24 },
    { id: "6", name: "Carpintería", icon: "🔨", color: "#F1F8E9", serviceCount: 16 },
    { id: "7", name: "Cocina", icon: "👨‍🍳", color: "#FFF8E1", serviceCount: 38 },
    { id: "8", name: "Mascotas", icon: "🐕", color: "#E0F2F1", serviceCount: 22 },
  ],
  featuredCategories: [],
  status: "idle",
  error: null,
}

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setFeaturedCategories: (state, action: PayloadAction<Category[]>) => {
      state.featuredCategories = action.payload
    },
    updateCategoryServiceCount: (state, action: PayloadAction<{ id: string; count: number }>) => {
      const category = state.items.find((cat) => cat.id === action.payload.id)
      if (category) {
        category.serviceCount = action.payload.count
      }
    },
  },
})

export const { setFeaturedCategories, updateCategoryServiceCount } = categoriesSlice.actions
export default categoriesSlice.reducer
