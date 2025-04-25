import { PLACEHOLDER_AVATAR } from "@/utils/constant";
import Image from "next/image";
import styled, { keyframes } from "styled-components";
import NeighborInfoCard from "./InfoCard";

interface WalkingAvatarProps extends User {
  initialwalkingprogress: number;
}

const WalkingAvatar = ({ ...user }: WalkingAvatarProps) => {
  return (
    <WalkingAvatarContainer
      initialwalkingprogress={user.initialwalkingprogress}
    >
      <NeighborInfoCard
        id={user.id}
        name={user.name}
        plantCount={user.plantCount}
        hobbies={user.hobbies}
      />
      <Image
        src={user.avatar || PLACEHOLDER_AVATAR}
        alt="Walking Avatar"
        width={120}
        height={240}
      />
    </WalkingAvatarContainer>
  );
};

export default WalkingAvatar;

const walkAnimation = keyframes`
  0% {
    transform: translateX(0);
    .info-card {
      transform: scale(0);
    }
  }
  50% {
    transform: translateX(400%) scaleX(1);
 
  }
  51% {
    transform: translateX(400%) scaleX(-1);
    .info-card {
      transform: scale(-1);
    }
  }
  100% {
    transform: translateX(0) scaleX(-1);
  }
`;

const WalkingAvatarContainer = styled.div<{ initialwalkingprogress: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 120px;
  height: fit-content;
  overflow: hidden;

  position: absolute;
  bottom: 3em;
  ${({ initialwalkingprogress }) =>
    initialwalkingprogress <= 50
      ? `left: ${initialwalkingprogress}%`
      : `right: ${100 - initialwalkingprogress}%`};

  animation: ${walkAnimation} 12s linear infinite;

  &:hover {
    animation-play-state: paused;

    & > img {
      width: 100%;
      aspect-ratio: 1/2;
      height: auto;
      transform: scale(1.05);
    }
  }

  .info-card {
    position: absolute;
    top: -200px;
  }
`;
