import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchLocalStores, fetchLocalStoreById } from '../../services/api';

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

const localStoresSlice = createSlice({
  name: 'localStores',
  initialState: {
    items: [],
    selected: null,
    status: 'idle',
    error: null as string | null,
  },
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
      });
  },
});

export const { clearSelected } = localStoresSlice.actions;
export default localStoresSlice.reducer; 