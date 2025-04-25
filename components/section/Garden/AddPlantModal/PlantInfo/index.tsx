import { Flex, Stack, Text } from "@mantine/core";
import { Plant } from "@/utils/types";
import { ST } from "next/dist/shared/lib/utils";

interface PlantInfoProps {
  plant: Plant;
}

const PlantInfo = ({ plant }: PlantInfoProps) => {
  return (
    <Stack gap={"0"} maw={"20em"}>
      <Text fw={700} size={"lg"}>
        {plant.name}
      </Text>
      <Text size="sm">{plant.description}</Text>
      <Flex gap={"md"}>
        <Stack gap={"2px"}>
          <Text c={"dimmed"} size="sm">
            Grow Time:
          </Text>
          <Text>{plant.growTime} days</Text>
        </Stack>
        <Stack gap={"2px"}>
          <Text c={"dimmed"} size="sm">
            Seed Price:
          </Text>
          <Text>{plant.seedPrice}</Text>
        </Stack>
      </Flex>
      <Flex gap={"md"}>
        <Stack gap={"2px"}>
          <Text c={"dimmed"} size="sm">
            Weather:
          </Text>
          <Text>{plant.weather}</Text>
        </Stack>
        <Stack gap={"2px"}>
          <Text c={"dimmed"} size="sm">
            Location:
          </Text>
          <Text>{plant.location}</Text>
        </Stack>
      </Flex>
    </Stack>
  );
};

export default PlantInfo;
