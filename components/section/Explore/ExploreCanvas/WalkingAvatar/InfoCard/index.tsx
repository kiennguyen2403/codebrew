import { getTitleFromPlantCount } from "@/utils/common-function";
import { Anchor, Box, Stack, Text } from "@mantine/core";

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
    <Box p={"md"} bg={"#E5E6BECC"} className="info-card" w={"16em"}>
      <Stack gap={"2px"} ta={"center"}>
        <Text fw={700} size="lg">
          {name}
        </Text>
        <Text c={"primary"}>{getTitleFromPlantCount(plantCount)}</Text>
        <Text c={"dimmed"} size="xs">
          {"Hobbies"}
        </Text>
        <Text>{hobbies.join(", ")}</Text>
        <Anchor href={`/garden/${id}`} fw={700}>
          {`"Click to See Garden"`}
        </Anchor>
      </Stack>
    </Box>
  );
};

export default NeighborInfoCard;
