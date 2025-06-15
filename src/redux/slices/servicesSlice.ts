import {
  createSlice,
  type PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import api from "../../services/api";
import type { RootState } from "../store";

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  image: string;
  category: {
    id: string;
    name: string;
  };
  provider: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
  };
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  duration?: number;
  features?: string[];
  images?: string[];
  isActive?: boolean;
  adminDeleted?: boolean;
  adminDeleteReason?: string;
  adminDeletedAt?: string;
  adminRestoredAt?: string;
}

interface ServicesState {
  items: Service[];
  popularServices: Service[];
  nearbyServices: Service[];
  selectedService: Service | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Thunk para obtener servicios reales
export const fetchServices = createAsyncThunk<
  Service[],
  { status?: "all" | "active" | "inactive" },
  { rejectValue: { message: string; data?: any }; state: RootState }
>("services/fetchServices", async (arg, { rejectWithValue, getState }) => {
    try {
    const state = getState();
    const user = state && (state as any).auth?.currentUser;
    let res;
    if (user?.role === "provider") {
      res = await api.get(`/services?provider=${user.id}`);
    } else if (user?.role === "admin" && arg?.status) {
      res = await api.get(`/services?status=${arg.status}`);
    } else {
      res = await api.get("/services");
    }
      // Mapear los servicios para que coincidan con la interfaz del frontend
      return res.data.services.map((s: any) => ({
        id: s._id,
        title: s.title,
        description: s.description,
        price: s.price,
        rating: s.rating || 0,
      image:
        s.images?.[0] ||
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
      images: s.images,
      category: {
        id: s.category?._id || s.category?.id || "",
        name: s.category?.name || "",
      },
      provider: {
        id: s.provider?._id || s.provider?.id || "",
        name: s.provider?.name || "",
        avatar:
          s.provider?.avatar ||
          "https://randomuser.me/api/portraits/men/32.jpg",
        rating: s.provider?.rating || 0,
      },
      location: {
        lat: s.location?.lat || 0,
        lng: s.location?.lng || 0,
        address: s.location?.address || "",
      },
      duration: s.duration,
      features: s.features,
      isActive: s.isActive,
      adminDeleted: s.adminDeleted,
      adminDeleteReason: s.adminDeleteReason,
      adminDeletedAt: s.adminDeletedAt,
      adminRestoredAt: s.adminRestoredAt,
    }));
  } catch (error: any) {
    return rejectWithValue({
      message: error.response?.data?.message || "Error al cargar servicios",
      data: error.response?.data,
    });
  }
});

// Thunk para crear servicio
export const createService = createAsyncThunk<
  Service,
  {
    title: string;
    description: string;
    price: number;
    duration: number;
    category: string; // categoryId
    images?: string[];
    features?: string[];
    availability?: any;
  },
  { rejectValue: { message: string; data?: any } }
>("services/createService", async (serviceData, { rejectWithValue }) => {
  try {
    const res = await api.post("/services", serviceData);
    const s = res.data.service;
    return {
      id: s._id,
      title: s.title,
      description: s.description,
      price: s.price,
      rating: s.rating || 0,
      image:
        s.images?.[0] ||
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
      category: {
        id: s.category?._id || s.category?.id || "",
        name: s.category?.name || "",
      },
      provider: {
        id: s.provider?._id || s.provider?.id || "",
        name: s.provider?.name || "",
        avatar:
          s.provider?.avatar ||
          "https://randomuser.me/api/portraits/men/32.jpg",
        rating: s.provider?.rating || 0,
      },
      location: {
        lat: s.location?.lat || 0,
        lng: s.location?.lng || 0,
        address: s.location?.address || "",
      },
      duration: s.duration,
      features: s.features,
    };
  } catch (error: any) {
    return rejectWithValue({
      message: error.response?.data?.message || "Error al crear servicio",
      data: error.response?.data,
    });
  }
});

// Thunk para actualizar servicio
export const updateServiceAsync = createAsyncThunk<
  Service,
  { id: string; data: Partial<Service> },
  { rejectValue: { message: string; data?: any } }
>("services/updateService", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/services/${id}`, data);
    const s = res.data.service;
    return {
      id: s._id,
      title: s.title,
      description: s.description,
      price: s.price,
      rating: s.rating || 0,
      image:
        s.images?.[0] ||
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
        category: {
          id: s.category?._id || s.category?.id || "",
        name: s.category?.name || "",
        },
        provider: {
          id: s.provider?._id || s.provider?.id || "",
          name: s.provider?.name || "",
        avatar:
          s.provider?.avatar ||
          "https://randomuser.me/api/portraits/men/32.jpg",
        rating: s.provider?.rating || 0,
        },
        location: {
          lat: s.location?.lat || 0,
          lng: s.location?.lng || 0,
        address: s.location?.address || "",
      },
      duration: s.duration,
      features: s.features,
    };
  } catch (error: any) {
    return rejectWithValue({
      message: error.response?.data?.message || "Error al actualizar servicio",
      data: error.response?.data,
    });
  }
});

// Thunk para eliminar servicio
export const deleteServiceAsync = createAsyncThunk<
  string,
  string,
  { rejectValue: { message: string; data?: any } }
>("services/deleteService", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/services/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue({
      message: error.response?.data?.message || "Error al eliminar servicio",
      data: error.response?.data,
    });
  }
});

// Thunk para eliminar servicio como admin
export const adminDeleteService = createAsyncThunk<
  string,
  { id: string; reason: string },
  { rejectValue: { message: string; data?: any } }
>(
  "services/adminDeleteService",
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      await api.patch(`/services/${id}/admin-delete`, { reason });
      return id;
    } catch (error: any) {
      return rejectWithValue({
        message:
          error.response?.data?.message || "Error al eliminar servicio (admin)",
        data: error.response?.data,
      });
    }
  },
);

// Thunk para restaurar servicio como admin
export const adminRestoreService = createAsyncThunk<
  string,
  string,
  { rejectValue: { message: string; data?: any } }
>("services/adminRestoreService", async (id, { rejectWithValue }) => {
  try {
    await api.patch(`/services/${id}/admin-restore`);
    return id;
  } catch (error: any) {
    return rejectWithValue({
      message:
        error.response?.data?.message || "Error al restaurar servicio (admin)",
      data: error.response?.data,
    });
    }
});

const initialState: ServicesState = {
  items: [],
  popularServices: [],
  nearbyServices: [],
  selectedService: null,
  status: "idle",
  error: null,
};

const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    setSelectedService: (state, action: PayloadAction<Service | null>) => {
      state.selectedService = action.payload;
    },
    addService: (state, action: PayloadAction<Service>) => {
      state.items.push(action.payload);
    },
    updateService: (state, action: PayloadAction<Service>) => {
      const index = state.items.findIndex(
        (service) => service.id === action.payload.id,
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteService: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (service) => service.id !== action.payload,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.popularServices = action.payload.slice(0, 4);
        state.error = null;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Error desconocido";
      })
      // Crear servicio
      .addCase(createService.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.push(action.payload);
        state.error = null;
      })
      .addCase(createService.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Error desconocido";
      })
      // Actualizar servicio
      .addCase(updateServiceAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateServiceAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        const idx = state.items.findIndex((s) => s.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
        state.error = null;
      })
      .addCase(updateServiceAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Error desconocido";
      })
      // Eliminar servicio
      .addCase(deleteServiceAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteServiceAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.filter((s) => s.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteServiceAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Error desconocido";
      })
      // Eliminar servicio como admin
      .addCase(adminDeleteService.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(adminDeleteService.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.filter((s) => s.id !== action.payload);
        state.error = null;
      })
      .addCase(adminDeleteService.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Error desconocido";
      })
      // Restaurar servicio como admin
      .addCase(adminRestoreService.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(adminRestoreService.fulfilled, (state, action) => {
        state.status = "succeeded";
        const idx = state.items.findIndex((s) => s.id === action.payload);
        if (idx !== -1) state.items[idx].isActive = true;
        state.error = null;
      })
      .addCase(adminRestoreService.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Error desconocido";
      });
  },
});

export const { setSelectedService, addService, updateService, deleteService } =
  servicesSlice.actions;
export default servicesSlice.reducer;
