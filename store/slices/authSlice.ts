import { RegisterUser } from "@/utils/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    { clerkId, userData }: { clerkId: string; userData: RegisterUser },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerk_id: clerkId,
          name: userData.name,
          gender: userData.gender,
          whatsapp: userData.whatsappNumber,
          location: {
            type: "Point",
            coordinates: [userData.location.lon, userData.location.lat],
          },
          hobbies: userData.hobbies,
          avatar: userData.avatar,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to register user");
      }
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

export const { setUser, setLoading, setError, clearAuth } = authSlice.actions;
export default authSlice.reducer;
