import {
  Box,
  Button,
  Flex,
  MultiSelect,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { HOBBIES } from "@/utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useEffect, useState } from "react";
import { getLocationName } from "@/store/slices/locationSlice";

interface OnboardingFormProps {
  setName: (name: string) => void;
  setGender: (gender: string) => void;
  setWhatsappNumber: (whatsappNumber: string) => void;
  setLocation: (location: { lon: number; lat: number }) => void;
  setHobbies: (hobbies: string[]) => void;
  validStep: boolean;
  handleNext: () => void;
}

const OnboardingForm = ({
  setName,
  setGender,
  setWhatsappNumber,
  setLocation,
  setHobbies,
  validStep,
  handleNext,
}: OnboardingFormProps) => {
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);

  const handleRetrieveAddress = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setLat(latitude);
        setLon(longitude);
        setLocation({ lat: latitude, lon: longitude });
      },
      (error) => {
        alert("Unable to retrieve your location");
        console.error(error);
      }
    );
  };

  // Update location in parent when lat/lon manually changed
  useEffect(() => {
    if (lat !== null && lon !== null) {
      setLocation({ lat, lon });
    }
  }, [lat, lon]);

  const { locationString } = useSelector((state: RootState) => state.location);

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    if (lon !== null && lat !== null) {
      dispatch(getLocationName(lat, lon));
    }
  }, [lon, lat]);

  return (
    <Stack>
      <Box
        w={{ base: "90vw", md: "75vw" }}
        py="lg"
        px="xl"
        style={{
          border: "8px solid var(--mantine-color-primary-6)",
        }}
      >
        <Stack gap="sm">
          <TextInput
            label="Name"
            placeholder="Enter your name"
            required
            onChange={(e) => setName(e.target.value)}
          />
          <Select
            label="Gender"
            data={["Male", "Female"]}
            placeholder="Farmer's Gender"
            required
            onChange={(value) => setGender(value ?? "")}
          />
          <Stack>
            <Stack gap="xs">
              <Text>Home Address</Text>
              <Flex gap="sm" align="end" wrap="wrap" mt={"-1.25em"}>
                <Button maw="20em" onClick={handleRetrieveAddress}>
                  Retrieve Address
                </Button>
                <NumberInput
                  label="Latitude"
                  placeholder="Enter your latitude"
                  value={lat ?? ""}
                  onChange={(value) => setLat(value as number)}
                  required
                />
                <NumberInput
                  label="Longitude"
                  placeholder="Enter your longitude"
                  value={lon ?? ""}
                  onChange={(value) => setLon(value as number)}
                  required
                />
              </Flex>

              {locationString && (
                <Stack gap={0}>
                  <Text size="xs" c="dimmed">
                    Detected Location:
                  </Text>
                  <Text fw={700} c={"primary"}>
                    {locationString}
                  </Text>
                </Stack>
              )}
            </Stack>
          </Stack>
          <TextInput
            label="Whatsapp Number"
            placeholder="+61 451 123 123"
            description="We will use this to communicate with other farmers"
            required
            onChange={(e) => setWhatsappNumber(e.target.value)}
          />
          <MultiSelect
            label="Hobbies"
            data={HOBBIES}
            placeholder="Select your hobbies"
            searchable
            clearable
            onChange={(value) => setHobbies(value ?? [])}
          />
        </Stack>
      </Box>
      <Flex w="100%" justify="center" pt="2em">
        <Button disabled={!validStep} onClick={handleNext} size="xl">
          Next
        </Button>
      </Flex>
    </Stack>
  );
};

export default OnboardingForm;
