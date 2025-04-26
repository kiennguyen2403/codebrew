import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "..";
import { Achievement } from "@/utils/types";
import { ACHIEVEMENTS } from "@/utils/constant";

interface AchievementState {
  loading: boolean;
  error: string | null;
  achievements: Achievement[];
}

const initialState: AchievementState = {
  loading: false,
  error: null,
  achievements: ACHIEVEMENTS,
};

const achievementSlice = createSlice({
  name: "achievement",
  initialState,
  reducers: {
    setAchievements(state, action: PayloadAction<Achievement[]>) {
      state.achievements = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const fetchAchievements = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await fetch("/api/v1/achievements");
    if (!response.ok) {
      throw new Error("Failed to fetch achievements");
    }
    const data: Achievement[] = await response.json();
    dispatch(setAchievements(data));
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

export const fetchUserAchievements =
  (userId: string) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await fetch(`/api/v1/users/${userId}/achievements`);
      if (!response.ok) {
        throw new Error("Failed to fetch user achievements");
      }
      const data: Achievement[] = await response.json();
      dispatch(setAchievements(data));
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

export const { setAchievements, setLoading, setError } =
  achievementSlice.actions;

export default achievementSlice.reducer;
