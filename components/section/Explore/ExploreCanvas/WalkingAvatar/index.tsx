import { PLACEHOLDER_AVATAR } from "@/utils/constant";
import Image from "next/image";
import styled, { keyframes } from "styled-components";
import NeighborInfoCard from "./InfoCard";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface WalkingAvatarProps extends User {
  initialwalkingprogress: number;
}

const WalkingAvatar = ({ ...user }: WalkingAvatarProps) => {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  return (
    <WalkingAvatarContainer
      initialwalkingprogress={user.initialwalkingprogress}
      hovered={hovered}
    >
      <NeighborInfoCardContainer className="info-card" hovered={hovered}>
        <NeighborInfoCard
          id={user.id}
          name={user.name}
          plantCount={user.plantCount}
          hobbies={user.hobbies}
        />
      </NeighborInfoCardContainer>
      <Image
        src={user.avatar || PLACEHOLDER_AVATAR}
        alt="Walking Avatar"
        width={120}
        height={240}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => {
          router.push(`/garden/${user.id}`);
        }}
      />
    </WalkingAvatarContainer>
  );
};

export default WalkingAvatar;

const walkAnimation = keyframes`
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(400%) scaleX(1);
  }
  51% {
    transform: translateX(400%) scaleX(-1);
  }
  100% {
    transform: translateX(0) scaleX(-1);
  }
`;

const WalkingAvatarContainer = styled.div<{
  initialwalkingprogress: number;
  hovered: boolean;
}>`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  width: 120px;
  height: 240px;

  position: absolute;
  bottom: 3em;
  ${({ initialwalkingprogress }) =>
    initialwalkingprogress <= 50
      ? `left: ${initialwalkingprogress}%`
      : `right: ${100 - initialwalkingprogress}%`};

  animation: ${walkAnimation} 12s linear infinite;

  ${({ hovered }) =>
    hovered &&
    `
    animation-play-state: paused;
    .info-card {
      animation-play-state: paused;
    }

    & > img {
      width: 100%;
      aspect-ratio: 1/2;
      height: auto;
      transform: scale(1.05);
      cursor: pointer;
    }
  `}
`;

const cardAnimation = keyframes`
  0% {
    transform:  scaleX(1);
  }
  50% {
    transform:  scaleX(1);
  }
  51% {
    transform: scaleX(-1);
  }
  100% {
    transform: scaleX(-1);
  }
`;

const NeighborInfoCardContainer = styled.div<{
  hovered: boolean;
}>`
  position: absolute;
  top: -200px;
  opacity: ${({ hovered }) => (hovered ? 1 : 0)};
  animation: ${cardAnimation} 12s linear infinite;
  transition: ease-in-out 0.33s;
`;
