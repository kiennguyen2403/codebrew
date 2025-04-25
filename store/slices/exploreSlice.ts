import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "..";
import { User } from "@/utils/types";
import { DUMMY_USERS } from "@/utils/dummy";

interface ExploreState {
  loading: boolean;
  error: string | null;
  neighbours: User[];
}

const initialState: ExploreState = {
  loading: false,
  error: null,
  neighbours: [],
};

const exploreSlice = createSlice({
  name: "explore",
  initialState,
  reducers: {
    setNeighbours(state, action: PayloadAction<User[]>) {
      state.neighbours = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const fetchNeighbours =
  (lat: number, lon: number, radiusKm: number) =>
  async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const rawData = DUMMY_USERS;
      let data: User[] = [];

      if (radiusKm <= 500) {
        data = rawData.slice(0, 2);
      } else if (radiusKm <= 1000) {
        data = rawData.slice(0, 4);
      } else {
        data = rawData;
      }

      // const response = await fetch(
      //   `/api/neighbours?lat=${lat}&lon=${lon}&radius=${radiusKm}`
      // );
      // const data = await response.json();
      dispatch(setNeighbours(data));
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

export const { setNeighbours, setLoading, setError } = exploreSlice.actions;
export default exploreSlice.reducer;
