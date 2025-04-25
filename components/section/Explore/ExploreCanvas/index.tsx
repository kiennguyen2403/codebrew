"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import WalkingAvatar from "./WalkingAvatar";
import DUMMY_USER from "@/utils/dummy";
import { getRandomNumber } from "@/utils/common-function";
import LocationMenu from "./LocationMenu";
import { Box, Text } from "@mantine/core";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
const SCENERY_DAY =
  "https://fljnffgnpjpfnzqnewxj.supabase.co/storage/v1/object/public/images//background_day.png";
const SCENERY_NIGHT =
  "https://fljnffgnpjpfnzqnewxj.supabase.co/storage/v1/object/public/images//background_night.png";
const SCENERY_NOON =
  "https://fljnffgnpjpfnzqnewxj.supabase.co/storage/v1/object/public/images//background_afternoon.png";

const ExploreCanvas = () => {
  const { neighbours, loading, error } = useSelector(
    (state: RootState) => state.explore
  );
  const [currScenery, setCurrScenery] = useState<string>(SCENERY_DAY);

  useEffect(() => {
    const updateScenery = () => {
      const currentHour = new Date().getHours();
      if (currentHour <= 12) {
        setCurrScenery(SCENERY_DAY);
      } else if (currentHour > 12 && currentHour < 17) {
        setCurrScenery(SCENERY_NOON);
      } else {
        setCurrScenery(SCENERY_NIGHT);
      }
    };
    updateScenery();
  }, []);

  const renderCanvasContent = () => {
    if (loading) {
      return (
        <Box
          bg={"secondary.3"}
          p={"md"}
          w={"fit-content"}
          style={{
            boxShadow: "4px 4px 0px 0px rgba(0, 0, 0, 0.5)",
            transform: "translateY(-2px)",
          }}
        >
          <Text>Loading Nearby Farmers...</Text>
        </Box>
      );
    }
    if (error) {
      return (
        <Box
          bg={"secondary.3"}
          p={"md"}
          w={"fit-content"}
          style={{
            boxShadow: "4px 4px 0px 0px rgba(0, 0, 0, 0.5)",
            transform: "translateY(-2px)",
          }}
        >
          <Text>Error: {error}</Text>
        </Box>
      );
    }
    if (neighbours && neighbours.length > 0) {
      return neighbours.map((neighbour, index) => (
        <WalkingAvatar
          key={neighbour.id || index}
          {...neighbour}
          initialwalkingprogress={getRandomNumber(0, 60)}
        />
      ));
    }
  };

  return (
    <ExploreCanvasContainer
      style={{
        backgroundImage: `url(${currScenery})`,
        backgroundPosition: "bottom",
      }}
    >
      <LocationMenuContainer>
        <LocationMenu />
      </LocationMenuContainer>
      {renderCanvasContent()}
      <WalkingAvatar
        {...DUMMY_USER}
        initialwalkingprogress={getRandomNumber(0, 60)}
      />
    </ExploreCanvasContainer>
  );
};

export default ExploreCanvas;

const LocationMenuContainer = styled.div`
  position: absolute;
  top: 2em;
  left: 2em;
`;

const ExploreCanvasContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 20px solid ${({ theme }) => theme.colors.secondary};
  width: 90%;
  height: 85vh;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 100vh;
  }
`;
