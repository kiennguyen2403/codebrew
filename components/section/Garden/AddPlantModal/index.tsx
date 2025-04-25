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
  setShowAddPlantModal,
} from "@/store/slices/gardenSlice";
import { DateInput } from "@mantine/dates";
import PlantList from "./PlantList";
import { Plant } from "@/utils/types";
import { useState } from "react";
import PlantInfo from "./PlantInfo";

const AddPlantModal = () => {
  const dispatch: AppDispatch = useDispatch();

  const [gardenId, setGardenId] = useState<string>("1");
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [plantedAt, setPlantedAt] = useState<Date | null>(new Date());
  const [quantity, setQuantity] = useState<number>(1);

  const handleAddPlant = () => {
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
