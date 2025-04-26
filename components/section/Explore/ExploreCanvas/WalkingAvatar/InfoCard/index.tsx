import { getTitleFromPlantCount } from "@/utils/common-function";
import { Anchor, Box, Stack, Text } from "@mantine/core";
import styled from "styled-components";
import Image from "next/image";
import { PLACEHOLDER_PLANT } from "@/utils/constant";

interface NeighborInfoCardProps {
  id: string;
  name: string;
  plantCount: number;
  hobbies: string[];
}

const NeighborInfoCard = ({
  id,
  name,
  plantCount,
  hobbies,
}: NeighborInfoCardProps) => {
  return (
    <Box
      p={"md"}
      bg={"#E5E6BECC"}
      className="info-card"
      w={"16em"}
      pos={"relative"}
    >
      <PlantCountInfo>
        <Text fw={700} size="md" c={"primary"}>
          {plantCount}
        </Text>
        <Image src={PLACEHOLDER_PLANT} alt="Plant" width={16} height={16} />
      </PlantCountInfo>
      <Stack gap={"2px"} ta={"center"}>
        <Text fw={700} size="lg">
          {name}
        </Text>
        <Text c={"primary"}>{getTitleFromPlantCount(plantCount)}</Text>
        <Text c={"dimmed"} size="xs">
          {"Hobbies"}
        </Text>
        <Text>{hobbies.join(", ")}</Text>

        {/* TODO: use dynamic, for now set to 1 */}
        <Anchor href={`/garden/1`} fw={700}>
          {`"Click to See Garden"`}
        </Anchor>
      </Stack>
    </Box>
  );
};

export default NeighborInfoCard;

const PlantCountInfo = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  align-items: center;

  position: absolute;
  top: 0.25em;
  right: 0.25em;
`;
