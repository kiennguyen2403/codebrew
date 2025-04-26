import { Box, Button, Stack, Text } from "@mantine/core";
import Image from "next/image";
import styled from "styled-components";

interface PlayerAvatarProps {
  src: string;
  name: string;
}

const PlayerAvatar = ({ src, name }: PlayerAvatarProps) => {
  const handleReachOut = () => {
    window.open(
      `https://wa.me/6281234567890?text=${encodeURIComponent(
        `Hello, I'm interested in your garden. Can we meet up to discuss this?`
      )}`,
      "_blank"
    );
  };

  return (
    <PlayerAvatarContainer>
      <Image
        src={src}
        alt={`${name}'s avatar`}
        width={300}
        height={150}
        style={{
          transform: "scaleX(-1)",
        }}
      />
      <Box className="player-name" bg={"secondary"} p={"xs"}>
        <Stack>
          <Text size="xl" fw={700}>
            {`${name}'s Garden`}
          </Text>
          <Button variant="primary" onClick={handleReachOut}>
            {"Reach Out"}
          </Button>
        </Stack>
      </Box>
    </PlayerAvatarContainer>
  );
};

export default PlayerAvatar;

const PlayerAvatarContainer = styled.div`
  width: 300px;
  height: auto;
  aspect-ratio: 1/2;
  position: relative;

  .player-name {
    position: absolute;
    bottom: 33%;
    right: 0;
  }

  & > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
