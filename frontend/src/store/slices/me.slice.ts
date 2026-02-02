import {
  createAsyncThunk,
  createSlice,
  isRejectedWithValue,
} from '@reduxjs/toolkit';
import { signOut } from 'next-auth/react';
import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants/api';

export interface Permission {
  id: number;
  name: string;
  key: string;
}

export interface MeState {
  data: {
    id: number;
    email: string;
    name: string;
    user_type_id: number;
    userType: {
      id: number;
      name: string;
    };
    permissions: Permission[];
    student_id?: number;
  } | null;
  loading: boolean;
}

const initialState: MeState = {
  data: null,
  loading: false,
};

export const fetchMe = createAsyncThunk('me/fetchMe', async () => {
  try {
    const res = await api.get(API_ENDPOINTS.ME);
    return res.data.data;
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      signOut({ callbackUrl: '/' });
    }

    return isRejectedWithValue(null);
  }
});

const meSlice = createSlice({
  name: 'me',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.data = null;
        state.loading = false;
      });
  },
});

export default meSlice.reducer;
