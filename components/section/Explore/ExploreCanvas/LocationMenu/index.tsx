import { AppDispatch, RootState } from "@/store";
import { fetchNeighbours } from "@/store/slices/exploreSlice";
import { Box, Select, Stack, Text } from "@mantine/core";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const LocationMenu = () => {
  const { locationString, lat, lon, loading } = useSelector(
    (state: RootState) => state.location
  );
  const { loading: loadingNeighbours } = useSelector(
    (state: RootState) => state.explore
  );
  const [currDistance, setCurrDistance] = useState<number>(
    DISTANCE_OPTIONS[0].value
  );

  const dispatch: AppDispatch = useDispatch();

  const handleDistanceChange = (value: string) => {
    setCurrDistance(Number(value));
    if (lat && lon) {
      dispatch(fetchNeighbours(lat, lon, Number(value)));
    }
  };

  return (
    <Stack>
      <Box
        bg={"secondary.3"}
        p={"md"}
        w={"fit-content"}
        style={{
          boxShadow: "4px 4px 0px 0px rgba(0, 0, 0, 0.5)",
          transform: "translateY(-2px)",
        }}
      >
        <Text fw={700} size="lg">
          {loading
            ? "Loading..."
            : locationString.split(",").slice(0, 4).join(",")}
        </Text>
      </Box>
      <Box
        bg={"secondary.3"}
        p={"md"}
        w={"fit-content"}
        style={{
          boxShadow: "4px 4px 0px 0px rgba(0, 0, 0, 0.5)",
          transform: "translateY(-2px)",
        }}
      >
        <Stack gap={"xs"}>
          <Text fw={700} size="lg">
            Distance from you:
          </Text>
          <Select
            data={DISTANCE_OPTIONS.map((option) => ({
              label: option.label,
              value: option.value.toString(),
            }))}
            value={currDistance.toString()}
            onChange={(value) => {
              if (value) {
                handleDistanceChange(value);
              }
            }}
            disabled={loading || loadingNeighbours}
          />
        </Stack>
      </Box>
    </Stack>
  );
};

export default LocationMenu;

const DISTANCE_OPTIONS = [
  { label: "1 min away", value: 500 },
  { label: "5 min away", value: 1000 },
  { label: "10 min away", value: 1500 },
  { label: "15 min away", value: 2000 },
];
