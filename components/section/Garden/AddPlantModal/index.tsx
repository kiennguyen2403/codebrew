import {
  Box,
  Button,
  Flex,
  NumberInput,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { AppDispatch } from "@/store";
import { useDispatch } from "react-redux";
import {
  addPlantToGarden,
  fetchRecommendedPlants,
  setShowAddPlantModal,
} from "@/store/slices/gardenSlice";
import { DateInput } from "@mantine/dates";
import PlantList from "./PlantList";
import { Plant } from "@/utils/types";
import { useEffect, useState } from "react";
import PlantInfo from "./PlantInfo";
import { notifications } from "@mantine/notifications";
import { ACHIEVEMENT_1_KEY, ACHIEVEMENT_2_KEY } from "@/utils/constant";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const AddPlantModal = () => {
  const dispatch: AppDispatch = useDispatch();

  const { gardenPlants } = useSelector((state: RootState) => state.garden);

  const [gardenId, setGardenId] = useState<string>("1");
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [plantedAt, setPlantedAt] = useState<Date | null>(new Date());
  const [quantity, setQuantity] = useState<number>(1);

  const [isFirstPlant, setIsFirstPlant] = useState<boolean>(() => {
    return !localStorage.getItem(ACHIEVEMENT_1_KEY);
  });
  const [isFifthPlant, setIsFifthPlant] = useState<boolean>(() => {
    return !localStorage.getItem(ACHIEVEMENT_2_KEY);
  });

  useEffect(() => {
    dispatch(fetchRecommendedPlants());
  }, [gardenId]);

  const handleAddPlant = () => {
    if (isFirstPlant && gardenPlants.length === 0) {
      notifications.show({
        title: "Congratulations! 🤩",
        message: "You've planted your FIRST plant!",
        color: "green",
      });
      setIsFirstPlant(false);
      localStorage.setItem(ACHIEVEMENT_1_KEY, "true");
    }

    if (isFifthPlant && gardenPlants.length === 4) {
      notifications.show({
        title: "Congratulations! 🤩",
        message: "You've planted your FIFTH plant!",
        color: "green",
      });
      setIsFifthPlant(false);
      localStorage.setItem(ACHIEVEMENT_2_KEY, "true");
    }

    if (selectedPlant && plantedAt && quantity) {
      dispatch(
        addPlantToGarden(
          selectedPlant,
          plantedAt.toISOString(),
          quantity,
          gardenId
        )
      );
    }
    dispatch(setShowAddPlantModal(false));
  };

  return (
    <Box
      p={"md"}
      bg={"secondary"}
      miw={"20em"}
      style={{
        boxShadow: "0px 0px 20px 0px rgba(0, 0, 0, 0.3)",
      }}
    >
      <Stack>
        <Flex w={"100%"} justify={"flex-end"} className="close-button">
          <Text
            fw={700}
            size={"xl"}
            onClick={() => dispatch(setShowAddPlantModal(false))}
            style={{ cursor: "pointer" }}
          >
            x
          </Text>
        </Flex>
        <Title>Add Plant</Title>
        <PlantList
          selectedPlant={selectedPlant}
          setSelectedPlant={setSelectedPlant}
        />
        {selectedPlant && <PlantInfo plant={selectedPlant} />}
        <DateInput
          label="Planted at"
          placeholder="Select date"
          defaultValue={new Date()}
          onChange={(date) => setPlantedAt(date)}
        />
        <NumberInput
          label="Quantity"
          placeholder="Quantity"
          defaultValue={1}
          onChange={(e) => setQuantity(Number(e))}
        />
        <Flex w={"100%"} justify={"space-between"}>
          <Button
            variant="outline"
            onClick={() => dispatch(setShowAddPlantModal(false))}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddPlant}
            disabled={!selectedPlant || !plantedAt || !quantity}
          >
            Add
          </Button>
        </Flex>
      </Stack>
    </Box>
  );
};

export default AddPlantModal;
