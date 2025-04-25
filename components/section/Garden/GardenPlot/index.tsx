import { Flex } from "@mantine/core";
import PlotBlock from "./PlotBlock";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { UserPlant } from "@/utils/types";
import { setShowPlantInfoModal } from "@/store/slices/gardenSlice";
import { setCurrentPlant } from "@/store/slices/gardenSlice";
import { AppDispatch } from "@/store";

const GardenPlot = () => {
  const dispatch: AppDispatch = useDispatch();
  const { gardenPlants } = useSelector((state: RootState) => state.garden);
  const emptyPlots = 16 - gardenPlants.length;

  const handleSeePlant = (plant: UserPlant) => {
    dispatch(setShowPlantInfoModal(true));
    dispatch(setCurrentPlant(plant));
  };

  return (
    <Flex
      maw={"40em"}
      wrap={"wrap"}
      style={{
        zIndex: 2,
      }}
    >
      {gardenPlants.map((plant, index) => (
        <PlotBlock
          key={index}
          plant={plant}
          handleSeePlant={handleSeePlant}
          empty={false}
        />
      ))}
      {Array.from({ length: emptyPlots }).map((_, index) => (
        <PlotBlock key={index} handleSeePlant={() => {}} empty={true} />
      ))}
    </Flex>
  );
};

export default GardenPlot;
