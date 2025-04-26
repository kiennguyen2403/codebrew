import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import locationReducer from "./slices/locationSlice";
import exploreReducer from "./slices/exploreSlice";
import gardenReducer from "./slices/gardenSlice";
import neighbourGardenReducer from "./slices/neighbourGardenSlice";
import achievementReducer from "./slices/achievementSlice";
import profileReducer from "./slices/profileSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    location: locationReducer,
    explore: exploreReducer,
    garden: gardenReducer,
    neighbourGarden: neighbourGardenReducer,
    achievement: achievementReducer,
    profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
