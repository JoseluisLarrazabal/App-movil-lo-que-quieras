import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import api from "../../services/api"

export interface User {
  _id: string
  name: string
  email: string
  role: "user" | "provider" | "admin"
  avatar?: string
  phone?: string
  status?: "active" | "suspended" | "pending"
  joinDate?: string
  totalBookings?: number
  totalSpent?: number
  totalServices?: number
  totalEarnings?: number
  rating?: number
}

interface UsersState {
  items: User[]
  selectedUser: User | null
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

export const fetchUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: { message: string; data?: any } }
>(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/users")
      const mapped = res.data.users.map((u: any) => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        avatar: u.avatar,
        phone: u.phone,
        status: u.isActive === false ? "suspended" : "active",
        joinDate: u.createdAt,
        totalBookings: u.userStats?.totalBookings ?? 0,
        totalSpent: u.userStats?.totalSpent ?? 0,
        totalServices: u.providerInfo?.services?.length ?? 0,
        totalEarnings: u.providerInfo?.completedJobs ? (u.providerInfo.completedJobs * 1000) : 0,
        rating: u.providerInfo?.rating ?? u.userStats?.averageRating ?? 0,
      }))
      return mapped
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || "Error al cargar usuarios",
        data: error.response?.data
      })
    }
  }
)

export const updateUser = createAsyncThunk<
  User,
  { id: string; data: Partial<User> },
  { rejectValue: { message: string; data?: any } }
>(
  "users/updateUser",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/users/${id}`, data)
      return res.data.user
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || "Error al actualizar usuario",
        data: error.response?.data
      })
    }
  }
)

export const changeUserStatus = createAsyncThunk<
  User,
  { id: string; isActive: boolean },
  { rejectValue: { message: string; data?: any } }
>(
  "users/changeUserStatus",
  async ({ id, isActive }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/users/${id}/status`, { isActive })
      return res.data.user
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || "Error al cambiar estado de usuario",
        data: error.response?.data
      })
    }
  }
)

export const deleteUser = createAsyncThunk<
  string,
  string,
  { rejectValue: { message: string; data?: any } }
>(
  "users/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/users/${id}`)
      return id
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || "Error al eliminar usuario",
        data: error.response?.data
      })
    }
  }
)

const initialState: UsersState = {
  items: [],
  selectedUser: null,
  status: "idle",
  error: null,
}

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.items = action.payload
        state.error = null
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload?.message || "Error desconocido"
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const idx = state.items.findIndex(u => u._id === action.payload._id)
        if (idx !== -1) state.items[idx] = action.payload
      })
      .addCase(changeUserStatus.fulfilled, (state, action) => {
        const idx = state.items.findIndex(u => u._id === action.payload._id)
        if (idx !== -1) state.items[idx] = action.payload
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.items = state.items.filter(u => u._id !== action.payload)
      })
  }
})

export const { setSelectedUser } = usersSlice.actions
export default usersSlice.reducer 