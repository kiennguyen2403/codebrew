import styled from "styled-components";
import GardenCanvas from "./GardenCanvas";
import GardenPlot from "./GardenPlot";
import PlayerAvatar from "./PlayerAvatar";
import { AVATAR_IMAGES } from "@/utils/constant";
import { useSelector } from "react-redux";
import AddPlantModal from "./AddPlantModal";
import { RootState } from "@/store";

const UserGarden = () => {
  const { showAddPlantModal } = useSelector((state: RootState) => state.garden);

  return (
    <GardenCanvas>
      <PlotContainer>
        <GardenPlot />
      </PlotContainer>
      <AvatarContainer>
        <PlayerAvatar src={AVATAR_IMAGES[0]} name={"Kevin Bryan"} />
      </AvatarContainer>
      {showAddPlantModal && (
        <AddPlantModalContainer>
          <AddPlantModal />
        </AddPlantModalContainer>
      )}
    </GardenCanvas>
  );
};

export default UserGarden;

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
