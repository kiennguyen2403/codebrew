import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "..";
import { Plant } from "@/utils/types";
import { DUMMY_RECOMMENDED_PLANTS } from "@/utils/dummy";

interface GardenState {
  loading: boolean;
  error: string | null;
  gardenPlants: Plant[];
  recommendedPlants: Plant[];
  showAddPlantModal: boolean;
}

const initialState: GardenState = {
  loading: false,
  error: null,
  gardenPlants: [],
  recommendedPlants: DUMMY_RECOMMENDED_PLANTS,
  showAddPlantModal: false,
};

const gardenSlice = createSlice({
  name: "garden",
  initialState,
  reducers: {
    setGardenPlants(state, action: PayloadAction<Plant[]>) {
      state.gardenPlants = action.payload;
    },
    setRecommendedPlants(state, action: PayloadAction<Plant[]>) {
      state.recommendedPlants = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    setShowAddPlantModal(state, action: PayloadAction<boolean>) {
      state.showAddPlantModal = action.payload;
    },
  },
});

export const fetchGardenPlants =
  (userId: string) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await fetch(`/api/garden?userId=${userId}`);
      const data = await response.json();
      dispatch(setGardenPlants(data));
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

export const fetchRecommendedPlants = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await fetch(`/api/recommended-plants`);
    const data = await response.json();
    dispatch(setRecommendedPlants(data));
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

export const addPlantToGarden =
  (plantId: number, plantedAt: string, quantity: number, gardenId: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await fetch(`/api/garden`, {
        method: "POST",
        body: JSON.stringify({ plantId, plantedAt, quantity, gardenId }),
      });
      const data = await response.json();
      dispatch(setGardenPlants(data));
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

export const {
  setGardenPlants,
  setRecommendedPlants,
  setLoading,
  setError,
  setShowAddPlantModal,
} = gardenSlice.actions;
export default gardenSlice.reducer;
