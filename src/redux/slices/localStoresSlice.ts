import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchLocalStores, fetchLocalStoreById, getMyLocalStores, createLocalStore as apiCreateLocalStore, updateLocalStore as apiUpdateLocalStore, deleteLocalStore as apiDeleteLocalStore } from '../../services/api';

export interface LocalStore {
  _id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  location: { lat: number; lng: number };
  contact?: { phone?: string; whatsapp?: string; website?: string };
  openingHours?: string;
  services?: string[];
  isActive?: boolean;
  featured?: boolean;
  images?: string[];
  description?: string;
  owner?: string;
}

export const getLocalStores = createAsyncThunk(
  'localStores/getLocalStores',
  async (params: { type?: string; city?: string; search?: string } = {}, { rejectWithValue }) => {
    try {
      const response = await fetchLocalStores(params);
      return response.stores;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Error al cargar comercios');
    }
  }
);

export const getLocalStoreDetail = createAsyncThunk(
  'localStores/getLocalStoreDetail',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetchLocalStoreById(id);
      return response.store;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Error al cargar comercio');
    }
  }
);

export const fetchMyLocalStores = createAsyncThunk(
  'localStores/fetchMyLocalStores',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMyLocalStores();
      return response.stores;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Error al cargar mis comercios');
    }
  }
);

export const createLocalStore = createAsyncThunk(
  'localStores/createLocalStore',
  async (data: Record<string, any>, { rejectWithValue }) => {
    try {
      const response = await apiCreateLocalStore(data);
      return response.store;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Error al crear comercio');
    }
  }
);

export const updateLocalStore = createAsyncThunk(
  'localStores/updateLocalStore',
  async ({ id, data }: { id: string; data: Record<string, any> }, { rejectWithValue }) => {
    try {
      const response = await apiUpdateLocalStore(id, data);
      return response.store;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Error al actualizar comercio');
    }
  }
);

export const deleteLocalStore = createAsyncThunk(
  'localStores/deleteLocalStore',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiDeleteLocalStore(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Error al eliminar comercio');
    }
  }
);

interface LocalStoresState {
  items: LocalStore[];
  selected: LocalStore | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: LocalStoresState = {
  items: [],
  selected: null,
  status: 'idle',
  error: null,
};

const localStoresSlice = createSlice({
  name: 'localStores',
  initialState,
  reducers: {
    clearSelected: (state) => {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLocalStores.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getLocalStores.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(getLocalStores.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(getLocalStoreDetail.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getLocalStoreDetail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selected = action.payload;
      })
      .addCase(getLocalStoreDetail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchMyLocalStores.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMyLocalStores.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchMyLocalStores.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(createLocalStore.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateLocalStore.fulfilled, (state, action) => {
        const idx = state.items.findIndex(f => f._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteLocalStore.fulfilled, (state, action) => {
        state.items = state.items.filter(f => f._id !== action.payload);
      });
  },
});

export const { clearSelected } = localStoresSlice.actions;
export default localStoresSlice.reducer; 