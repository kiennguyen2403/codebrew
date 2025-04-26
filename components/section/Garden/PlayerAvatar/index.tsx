import { Box, Button, Stack, Text } from "@mantine/core";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styled from "styled-components";

interface PlayerAvatarProps {
  src: string;
  name: string;
  isMe?: boolean;
  id?: string;
}

const PlayerAvatar = ({ src, name, isMe = false, id }: PlayerAvatarProps) => {
  const handleReachOut = () => {
    window.open(
      `https://wa.me/6281234567890?text=${encodeURIComponent(
        `Hello, I'm interested in your garden. Can we meet up to discuss this?`
      )}`,
      "_blank"
    );
  };

  const router = useRouter();

  const handleViewAchievements = () => {
    if (isMe) {
      router.push("/achievement");
    } else {
      router.push(`/achievement/${id || 1}`);
    }
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
        className="avatar"
      />

      <Box className="player-name" bg={"secondary"} p={"xs"}>
        <Stack>
          <Text size="xl" fw={700}>
            {`${name}'s Garden`}
          </Text>
          {!isMe && (
            <Button variant="primary" onClick={handleReachOut}>
              {"Reach Out"}
            </Button>
          )}
          <Button
            variant="primary"
            onClick={handleViewAchievements}
            bg="gold"
            c={"black"}
          >
            {"View Achievements"}
          </Button>
        </Stack>
      </Box>
    </PlayerAvatarContainer>
  );
};

export default PlayerAvatar;

const PlayerAvatarContainer = styled.div`
  width: 320px;
  height: auto;
  aspect-ratio: 1/2;
  position: relative;

  .player-name {
    position: absolute;
    bottom: 30%;
  }

  .avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(150%);
  }
`;
