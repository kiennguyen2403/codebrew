import { getTitleFromPlantCount } from "@/utils/common-function";
import { Box, Stack, Text } from "@mantine/core";

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
    <Box p={"md"} bg={"#E5E6BECC"} className="info-card">
      <Stack>
        <Text>{name}</Text>
        <Text>{getTitleFromPlantCount(plantCount)}</Text>
        <Text>{hobbies.join(", ")}</Text>
        <Text>{name}</Text>
        <Text>{name}</Text>
      </Stack>
    </Box>
  );
};

export default NeighborInfoCard;
