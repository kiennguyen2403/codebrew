import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "..";
import { Achievement, User } from "@/utils/types";
import { ACHIEVEMENTS } from "@/utils/constant";

interface ProfileState {
  loading: boolean;
  error: string | null;
  profile: User | null;
}

const initialState: ProfileState = {
  loading: false,
  error: null,
  profile: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<User>) {
      state.profile = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const fetchProfile =
  (redirectToOnboarding?: () => void) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await fetch("/api/v1/profile", {
        // Add cache control headers to prevent refetching
        headers: {
          "Cache-Control": "max-age=300", // Cache for 5 minutes
          Pragma: "no-cache", // For backwards compatibility
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized access");
        }
        throw new Error("Failed to fetch profile");
      }
      const data: User = await response.json();
      console.log(data);
      if (!data.username && redirectToOnboarding) {
        redirectToOnboarding();
        return;
      }
      dispatch(setProfile(data));
    } catch (error) {
      dispatch(
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        )
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

export const { setProfile, setLoading, setError } = profileSlice.actions;

export default profileSlice.reducer;
