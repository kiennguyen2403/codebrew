import { setShowAddPlantModal } from "@/store/slices/gardenSlice";
import { UserPlant } from "@/utils/types";
import { Button, Text } from "@mantine/core";
import Image from "next/image";
import styled from "styled-components";
import { AppDispatch } from "@/store";
import { useDispatch } from "react-redux";
import { calculateRemainingGrowTime } from "@/utils/common-function";

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

  const isReadyToHarvest =
    plant && calculateRemainingGrowTime(plant.plantedDate, plant.growTime) <= 0;

  return (
    <PlotBlockContainer empty={empty.toString()}>
      {isReadyToHarvest && (
        <StarContainer>
          <Image
            src={"/images/assets/star.png"}
            alt="star"
            width={60}
            height={60}
          />
        </StarContainer>
      )}
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
        <Button
          variant="transparent"
          color={"secondary"}
          onClick={handleAddPlant}
        >
          <Text size="6em" c={"secondary"}>
            {"+"}
          </Text>
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

  outline: 6px dashed ${({ theme }) => theme.colors.secondary};
  filter: ${({ empty }) =>
    empty === "true" ? "brightness(0.8) saturate(0.8) contrast(0.8)" : "none"};

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

const StarContainer = styled.div`
  position: absolute;
  top: -1em;
  right: -1em;

  width: 4em;
  height: 4em;
  aspect-ratio: 1/1;
  z-index: 5;

  & > img {
    aspect-ratio: 1/1;
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: brightness(1.2) contrast(1.2) saturate(1.2)
      drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
  }
`;
