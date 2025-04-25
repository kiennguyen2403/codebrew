import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "..";

interface LocationDetail {
  suburb: string;
  city: string;
}

interface LocationState {
  loading: boolean;
  locationString: string;
  lon: number | null;
  lat: number | null;
  locationDetail: LocationDetail | null;
  error: string | null;
}

const initialState: LocationState = {
  loading: false,
  locationString: "",
  lon: 144.9631,
  lat: -37.8136,
  locationDetail: null,
  error: null,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocationString(state, action: PayloadAction<string>) {
      state.locationString = action.payload;
    },
    setCoordinates(state, action: PayloadAction<{ lon: number; lat: number }>) {
      state.lon = action.payload.lon;
      state.lat = action.payload.lat;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setLocationDetail(state, action: PayloadAction<LocationDetail>) {
      state.locationDetail = action.payload;
    },
    clearLocation(state) {
      state.locationString = "";
      state.lon = null;
      state.lat = null;
      state.loading = false;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const getLocationName =
  (lat: number, lon: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(locationSlice.actions.setLoading(true));
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch location data");
      }
      const data = await res.json();

      const locationName =
        data.display_name || `${data.address.suburb}, ${data.address.city}`;

      dispatch(
        locationSlice.actions.setLocationDetail({
          suburb: data.address.suburb,
          city: data.address.city,
        })
      );
      dispatch(locationSlice.actions.setLocationString(locationName));
      return locationName;
    } catch (error: unknown) {
      dispatch(
        locationSlice.actions.setError(
          error instanceof Error
            ? error.message
            : "Error fetching location data"
        )
      );
    } finally {
      dispatch(locationSlice.actions.setLoading(false));
    }
  };

export const {
  setLocationString,
  setCoordinates,
  setLoading,
  clearLocation,
  setLocationDetail,
} = locationSlice.actions;
export default locationSlice.reducer;
