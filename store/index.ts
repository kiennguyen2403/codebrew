import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import locationReducer from "./slices/locationSlice";
import exploreReducer from "./slices/exploreSlice";
import gardenReducer from "./slices/gardenSlice";
import neighbourGardenReducer from "./slices/neighbourGardenSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    location: locationReducer,
    explore: exploreReducer,
    garden: gardenReducer,
    neighbourGarden: neighbourGardenReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
