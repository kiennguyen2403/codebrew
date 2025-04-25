import { Box, Flex, Stack, Text } from "@mantine/core";
import Image from "next/image";
import { UserPlant } from "@/utils/types";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  calculateRemainingGrowTime,
  getRemainingGrowTimeString,
} from "@/utils/common-function";
import styled from "styled-components";

interface UserPlantInfoModalProps {
  isMine?: boolean;
}

const UserPlantInfoModal = ({ isMine = true }: UserPlantInfoModalProps) => {
  const { currentPlant } = useSelector((state: RootState) => state.garden);
  const { currentPlant: neighbourCurrentPlant } = useSelector(
    (state: RootState) => state.neighbourGarden
  );

  if (!currentPlant && !neighbourCurrentPlant) {
    return null;
  }

  if (isMine && currentPlant) {
    return (
      <UserPlantInfoModalContainer>
        <Box bg={"secondary"} p={"md"}>
          <Stack>
            <Text fw={700} size={"lg"}>
              {currentPlant.name}
            </Text>
            <Text
              fw={700}
              c={
                calculateRemainingGrowTime(
                  currentPlant.plantedDate,
                  currentPlant.growTime
                ) <= 0
                  ? "pink"
                  : "black"
              }
            >
              {getRemainingGrowTimeString(
                calculateRemainingGrowTime(
                  currentPlant.plantedDate,
                  currentPlant.growTime
                )
              )}
            </Text>
            <Text>{currentPlant.description}</Text>
            <Flex gap={"md"}>
              <Stack gap={0}>
                <Text c={"dimmed"} size="sm">
                  Season
                </Text>
                <Text fw={700}>{currentPlant.weather}</Text>
              </Stack>
              <Stack gap={0}>
                <Text c={"dimmed"} size="sm">
                  Location
                </Text>
                <Text fw={700}>{currentPlant.location}</Text>
              </Stack>
            </Flex>
            <Stack gap={0}>
              <Text c={"dimmed"} size="sm">
                Seed Price
              </Text>
              <Text fw={700}>{currentPlant.seedPrice}</Text>
            </Stack>
          </Stack>
        </Box>
      </UserPlantInfoModalContainer>
    );
  }

  if (!isMine && neighbourCurrentPlant) {
    return (
      <UserPlantInfoModalContainer>
        <Box bg={"secondary"} p={"md"}>
          <Stack>
            <Text fw={700} size={"lg"}>
              {neighbourCurrentPlant.name}
            </Text>
            <Text
              fw={700}
              c={
                calculateRemainingGrowTime(
                  neighbourCurrentPlant.plantedDate,
                  neighbourCurrentPlant.growTime
                ) <= 0
                  ? "pink"
                  : "black"
              }
            >
              {getRemainingGrowTimeString(
                calculateRemainingGrowTime(
                  neighbourCurrentPlant.plantedDate,
                  neighbourCurrentPlant.growTime
                )
              )}
            </Text>
            <Text>{neighbourCurrentPlant.description}</Text>
            <Flex gap={"md"}>
              <Stack gap={0}>
                <Text c={"dimmed"} size="sm">
                  Season
                </Text>
                <Text fw={700}>{neighbourCurrentPlant.weather}</Text>
              </Stack>
              <Stack gap={0}>
                <Text c={"dimmed"} size="sm">
                  Location
                </Text>
                <Text fw={700}>{neighbourCurrentPlant.location}</Text>
              </Stack>
            </Flex>
            <Stack gap={0}>
              <Text c={"dimmed"} size="sm">
                Seed Price
              </Text>
              <Text fw={700}>{neighbourCurrentPlant.seedPrice}</Text>
            </Stack>
          </Stack>
        </Box>
      </UserPlantInfoModalContainer>
    );
  }
};

export default UserPlantInfoModal;

const UserPlantInfoModalContainer = styled.div`
  position: absolute;
  right: 2em;
  top: 2em;
  z-index: 1000;
  max-width: 20em;
  pointer-events: none;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.25);
  border: 2px solid black;

  @media (max-width: 768px) {
    right: 1em;
    bottom: 2em;
    top: auto;
  }
`;
