import { useSelector } from "react-redux";
import styled from "styled-components";
import PlantItem from "./PlantItem";
import { RootState } from "@/store";
import { useState } from "react";
import { Plant } from "@/utils/types";
import { Text } from "@mantine/core";
interface PlantListProps {
  selectedPlant: Plant | null;
  setSelectedPlant: (plant: Plant | null) => void;
}

const PlantList = ({ selectedPlant, setSelectedPlant }: PlantListProps) => {
  const { recommendedPlants } = useSelector((state: RootState) => state.garden);

  return (
    <PlantListContainer>
      <Text fw={700} size={"lg"}>
        Recommended Plants
      </Text>
      <PlantListWrapper>
        {recommendedPlants.map((plant) => (
          <PlantItem
            key={plant.id}
            id={plant.id}
            image={plant.image}
            name={plant.name}
            selected={selectedPlant?.id === plant.id}
            handleSelect={() => {
              setSelectedPlant(plant);
            }}
          />
        ))}
      </PlantListWrapper>
    </PlantListContainer>
  );
};

export default PlantList;

const PlantListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  width: 100%;
  max-width: 100%;
  max-height: 16em;
  overflow-y: scroll;
  padding: ${({ theme }) => theme.spacing.xs};
`;

const PlantListWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  width: 100%;
  max-height: 16em;
  height: fit-content;
`;
