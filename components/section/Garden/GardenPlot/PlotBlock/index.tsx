import { setShowAddPlantModal } from "@/store/slices/gardenSlice";
import { UserPlant } from "@/utils/types";
import { Button, Text } from "@mantine/core";
import Image from "next/image";
import styled from "styled-components";
import { AppDispatch } from "@/store";
import { useDispatch } from "react-redux";

interface PlotBlockProps {
  plant?: UserPlant;
  handleSeePlant: (plant: UserPlant) => void;
  empty?: boolean;
  addable?: boolean;
}

const PLOT_BLOCK_IMAGE =
  "https://fljnffgnpjpfnzqnewxj.supabase.co/storage/v1/object/public/images//plot_block.png";

const PlotBlock = ({
  plant,
  handleSeePlant,
  empty = true,
  addable = true,
}: PlotBlockProps) => {
  const dispatch: AppDispatch = useDispatch();

  const handleAddPlant = () => {
    dispatch(setShowAddPlantModal(true));
  };

  const handleHover = (plant: UserPlant) => {
    handleSeePlant(plant);
  };

  return (
    <PlotBlockContainer empty={empty.toString()}>
      {plant && (
        <PlantImageContainer
          onMouseEnter={() => {
            handleHover(plant);
          }}
        >
          <Image
            src={plant.image}
            width={120}
            height={120}
            alt={plant.name}
            style={{ objectFit: "contain" }}
          />
        </PlantImageContainer>
      )}
      {!plant && addable && (
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

  outline: 8px solid ${({ theme }) => theme.colors.secondary};

  display: flex;
  justify-content: center;
  align-items: center;
`;

const PlantImageContainer = styled.div`
  width: 80%;
  height: 80%;
  border-radius: 10px;
  overflow: hidden;
  z-index: 2;

  & > img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    &:hover {
      filter: brightness(1.1) contrast(1.1) saturate(1.1);
      transform: scale(1.1);
    }
  }
`;
