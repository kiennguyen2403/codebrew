import { Flex } from "@mantine/core";
import PlotBlock from "./PlotBlock";

const GardenPlot = () => {
  return (
    <Flex
      maw={"40em"}
      wrap={"wrap"}
      style={{
        zIndex: 2,
      }}
    >
      {Array.from({ length: 16 }).map((_, index) => (
        <PlotBlock key={index} handleSeePlant={() => {}} />
      ))}
    </Flex>
  );
};

export default GardenPlot;
