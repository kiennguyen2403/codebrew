import { Plant } from "@/utils/types";
import { Button, Text } from "@mantine/core";
import Image from "next/image";
import styled from "styled-components";
import { AppDispatch } from "@/store";
import { setShowAddPlantModal } from "@/store/slices/gardenSlice";
import { useDispatch } from "react-redux";

interface PlotBlockProps {
  plant?: Plant;
  handleSeePlant: () => void;
}

const PLOT_BLOCK_IMAGE =
  "https://fljnffgnpjpfnzqnewxj.supabase.co/storage/v1/object/public/images//plot_block.png";

const PlotBlock = ({ plant, handleSeePlant }: PlotBlockProps) => {
  const dispatch: AppDispatch = useDispatch();

  const handleAddPlant = () => {
    dispatch(setShowAddPlantModal(true));
  };

  return (
    <PlotBlockContainer empty={Boolean(plant).toString()}>
      {plant && (
        <PlantImageContainer onClick={handleSeePlant}>
          <Image src={plant.image} width={120} height={120} alt={plant.name} />
        </PlantImageContainer>
      )}
      {!plant && (
        <Button variant="outline" color={"secondary"} onClick={handleAddPlant}>
          <Text size="xl">{"+"}</Text>
        </Button>
      )}
    </PlotBlockContainer>
  );
};

export default PlotBlock;

const PlotBlockContainer = styled.div<{ empty: string }>`
  position: relative;
  width: 25%;
  height: auto;
  aspect-ratio: 1/1;
  background-image: url(${PLOT_BLOCK_IMAGE});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: ${({ empty }) => (empty === "true" ? "brightness(-25%)" : "none")};

  outline: 8px solid ${({ theme }) => theme.colors.secondary};

  display: flex;
  justify-content: center;
  align-items: center;
`;

const PlantImageContainer = styled.div`
  width: 80%;
  height: 80%;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  z-index: 2;
`;
