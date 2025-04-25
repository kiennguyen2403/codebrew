import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "..";
import { Plant, UserPlant } from "@/utils/types";
import { DUMMY_RECOMMENDED_PLANTS, DUMMY_USER_PLANTS } from "@/utils/dummy";

interface GardenState {
  loading: boolean;
  error: string | null;
  gardenPlants: UserPlant[];
  recommendedPlants: Plant[];
  showAddPlantModal: boolean;
  showPlantInfoModal: boolean;
  currentPlant: UserPlant | null;
}

const initialState: GardenState = {
  loading: false,
  error: null,
  gardenPlants: DUMMY_USER_PLANTS,
  recommendedPlants: DUMMY_RECOMMENDED_PLANTS,
  showAddPlantModal: false,
  showPlantInfoModal: false,
  currentPlant: null,
};

const gardenSlice = createSlice({
  name: "garden",
  initialState,
  reducers: {
    setGardenPlants(state, action: PayloadAction<UserPlant[]>) {
      state.gardenPlants = action.payload;
    },
    appendGardenPlants(state, action: PayloadAction<UserPlant>) {
      state.gardenPlants = [...state.gardenPlants, action.payload];
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
    setShowPlantInfoModal(state, action: PayloadAction<boolean>) {
      state.showPlantInfoModal = action.payload;
    },
    setCurrentPlant(state, action: PayloadAction<UserPlant>) {
      state.currentPlant = action.payload;
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
  (plant: Plant, plantedAt: string, quantity: number, gardenId: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      // const response = await fetch(`/api/garden`, {
      //   method: "POST",
      //   body: JSON.stringify({ plantId, plantedAt, quantity, gardenId }),
      // });
      // const data = await response.json();
      // dispatch(setGardenPlants([...state.gardenPlants, newUserPlant]));
      const newUserPlant: UserPlant = {
        ...plant,
        plantedDate: plantedAt,
        quantity,
      };
      dispatch(appendGardenPlants(newUserPlant));
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
  appendGardenPlants,
  setShowPlantInfoModal,
  setCurrentPlant,
} = gardenSlice.actions;
export default gardenSlice.reducer;
