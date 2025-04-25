import { useEffect, useState } from "react";
import styled from "styled-components";
import WalkingAvatar from "./WalkingAvatar";
import DUMMY_USER from "@/utils/dummy";
import { getRandomNumber } from "@/utils/common-function";

const SCENERY_DAY = "/images/scenery/background_afternoon.png";
const SCENERY_NIGHT = "/images/scenery/background_night.png";
const SCENERY_NOON = "/images/scenery/background_noon.png";

const ExploreCanvas = () => {
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

  return (
    <ExploreCanvasContainer
      style={{
        backgroundImage: `url(${currScenery})`,
        backgroundPosition: "bottom",
      }}
    >
      {/* TODO: location card and distance picker */}
      {/* TODO: neighbors walking npcs */}
      <WalkingAvatar
        {...DUMMY_USER}
        initialwalkingprogress={getRandomNumber(0, 60)}
      />
    </ExploreCanvasContainer>
  );
};

export default ExploreCanvas;

const ExploreCanvasContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 20px solid ${({ theme }) => theme.colors.secondary};
  width: 90%;
  height: 85vh;
  position: relative;
  overflow: hidden;
`;
