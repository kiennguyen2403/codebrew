import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "..";
import { Plant, UserPlant } from "@/utils/types";
import { DUMMY_NEIGHBOR_PLANTS } from "@/utils/dummy";

interface NeighbourGardenPlantsState {
  loading: boolean;
  error: string | null;
  gardenPlants: UserPlant[];
  showPlantInfoModal: boolean;
  currentPlant: UserPlant | null;
}

const initialState: NeighbourGardenPlantsState = {
  loading: false,
  error: null,
  gardenPlants: DUMMY_NEIGHBOR_PLANTS,
  showPlantInfoModal: false,
  currentPlant: null,
};

const neighbourGardenSlice = createSlice({
  name: "neighbourGarden",
  initialState,
  reducers: {
    setGardenPlants(state, action: PayloadAction<UserPlant[]>) {
      state.gardenPlants = action.payload;
    },
    appendGardenPlants(state, action: PayloadAction<UserPlant>) {
      state.gardenPlants = [...state.gardenPlants, action.payload];
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    setShowPlantInfoModal(state, action: PayloadAction<boolean>) {
      state.showPlantInfoModal = action.payload;
    },
    setCurrentPlant(state, action: PayloadAction<UserPlant>) {
      state.currentPlant = action.payload;
    },
  },
});

export const fetchNeighbourGardenPlants =
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

export const {
  setGardenPlants,
  setLoading,
  setError,
  setShowPlantInfoModal,
  setCurrentPlant,
} = neighbourGardenSlice.actions;
export default neighbourGardenSlice.reducer;
