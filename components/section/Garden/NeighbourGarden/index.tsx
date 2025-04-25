import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { AVATAR_IMAGES } from "@/utils/constant";
import UserPlantInfoModal from "../UserPlantInfoModal";
import GardenCanvas from "../GardenCanvas";
import PlayerAvatar from "../PlayerAvatar";
import NeighbourGardenPlot from "../GardenPlot/NeighbourGardenPlot";

const NeighbourGarden = () => {
  const { showPlantInfoModal, currentPlant } = useSelector(
    (state: RootState) => state.neighbourGarden
  );

  return (
    <GardenCanvas>
      {showPlantInfoModal && currentPlant && (
        <UserPlantInfoModal isMine={false} />
      )}
      <PlotContainer>
        <NeighbourGardenPlot />
      </PlotContainer>
      <AvatarContainer>
        <PlayerAvatar src={AVATAR_IMAGES[3]} name={"LeBron James"} />
      </AvatarContainer>
    </GardenCanvas>
  );
};

export default NeighbourGarden;

const PlotContainer = styled.div`
  position: absolute;
  left: 2em;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
`;

const AvatarContainer = styled.div`
  position: absolute;
  right: 0;
  bottom: -10em;
  z-index: 2;

  width: 33%;
  height: auto;
  aspect-ratio: 1/1;
`;

const AddPlantModalContainer = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
`;
