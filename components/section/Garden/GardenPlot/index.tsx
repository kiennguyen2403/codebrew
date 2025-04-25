import { Flex } from "@mantine/core";
import PlotBlock from "./PlotBlock";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useEffect, useState } from "react";
import { UserPlant } from "@/utils/types";

const GardenPlot = () => {
  const { gardenPlants } = useSelector((state: RootState) => state.garden);
  const emptyPlots = 16 - gardenPlants.length;

  return (
    <Flex
      maw={"40em"}
      wrap={"wrap"}
      style={{
        zIndex: 2,
      }}
    >
      {gardenPlants.map((plant, index) => (
        <PlotBlock
          key={index}
          plant={plant}
          handleSeePlant={() => {}}
          empty={false}
        />
      ))}
      {Array.from({ length: emptyPlots }).map((_, index) => (
        <PlotBlock key={index} handleSeePlant={() => {}} empty={true} />
      ))}
    </Flex>
  );
};

export default GardenPlot;
