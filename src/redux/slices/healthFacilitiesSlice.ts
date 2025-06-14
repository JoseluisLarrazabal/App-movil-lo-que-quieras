import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";

export interface HealthFacility {
  _id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  location: { lat: number; lng: number };
  contact: { phone?: string; email?: string; website?: string };
  openingHours?: string;
  services?: string[];
  isActive?: boolean;
}

interface State {
  items: HealthFacility[];
  selected: HealthFacility | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: State = {
  items: [],
  selected: null,
  status: "idle",
  error: null,
};

export const fetchHealthFacilities = createAsyncThunk<HealthFacility[], { type?: string; city?: string; search?: string } | void, { rejectValue: { message: string } }>(
  "healthFacilities/fetch",
  async (params, { rejectWithValue }) => {
    try {
      let query = "";
      if (params) {
        const q = Object.entries(params)
          .filter(([, v]) => v)
          .map(([k, v]) => `${k}=${encodeURIComponent(v as string)}`)
          .join("&");
        if (q) query = `?${q}`;
      }
      const res = await api.get(`/health-facilities${query}`);
      return res.data.facilities;
    } catch (error: any) {
      return rejectWithValue({ message: error.response?.data?.message || "Error al cargar establecimientos" });
    }
  }
);

export const createHealthFacility = createAsyncThunk<HealthFacility, Partial<HealthFacility>, { rejectValue: { message: string } }>(
  "healthFacilities/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/health-facilities", data);
      return res.data.facility;
    } catch (error: any) {
      return rejectWithValue({ message: error.response?.data?.message || "Error al crear establecimiento" });
    }
  }
);

export const updateHealthFacility = createAsyncThunk<HealthFacility, { id: string; data: Partial<HealthFacility> }, { rejectValue: { message: string } }>(
  "healthFacilities/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/health-facilities/${id}`, data);
      return res.data.facility;
    } catch (error: any) {
      return rejectWithValue({ message: error.response?.data?.message || "Error al actualizar establecimiento" });
    }
  }
);

export const deleteHealthFacility = createAsyncThunk<string, string, { rejectValue: { message: string } }>(
  "healthFacilities/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/health-facilities/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue({ message: error.response?.data?.message || "Error al eliminar establecimiento" });
    }
  }
);

const healthFacilitiesSlice = createSlice({
  name: "healthFacilities",
  initialState,
  reducers: {
    setSelectedHealthFacility(state, action: PayloadAction<HealthFacility | null>) {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHealthFacilities.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchHealthFacilities.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchHealthFacilities.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Error desconocido";
      })
      .addCase(createHealthFacility.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateHealthFacility.fulfilled, (state, action) => {
        const idx = state.items.findIndex(f => f._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteHealthFacility.fulfilled, (state, action) => {
        state.items = state.items.filter(f => f._id !== action.payload);
      });
  },
});

export const { setSelectedHealthFacility } = healthFacilitiesSlice.actions;
export default healthFacilitiesSlice.reducer; 