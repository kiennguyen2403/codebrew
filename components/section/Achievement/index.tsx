import { Box, Stack, Title, Text, Flex } from "@mantine/core";
import styled from "styled-components";
import Image from "next/image";
import { ACHIEVEMENTS } from "@/utils/constant";

const AchievementList = () => {
  return (
    <Stack w={"100%"} h={"100%"} align="center" pos={"relative"}>
      <Title c={"primary"} fw={700} ta={"center"}>
        Achievements
      </Title>
      <Flex w={"90vw"} gap={"md"} h={"fit-content"} wrap={"wrap"}>
        {ACHIEVEMENTS.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            unlocked={achievement.unlocked ? "true" : "false"}
          >
            <AchievementStar>
              <Image
                src={"/images/assets/star.png"}
                alt="achievement star"
                width={100}
                height={100}
              />
            </AchievementStar>
            <Stack
              gap={"xs"}
              style={{
                zIndex: 2,
              }}
            >
              <Text fw={700} size="lg">
                {achievement.title}
              </Text>
              <Text>{achievement.description}</Text>
              <Text size="sm" c="dimmed">
                {achievement.unlockedAt || "??/??/????"}
              </Text>
            </Stack>
          </AchievementCard>
        ))}
      </Flex>
    </Stack>
  );
};

export default AchievementList;

interface AchievementCardProps {
  unlocked: string;
}

const AchievementCard = styled.div<AchievementCardProps>`
  width: 30%;
  height: fit-content;
  min-height: 10em;
  position: relative;
  background-color: white;
  padding: 1em;
  margin: 1em 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  transition: all 0.3s ease;
  opacity: ${(props) => (props.unlocked === "true" ? 1 : 0.5)};
  overflow: hidden;
  outline: 4px dashed ${({ theme }) => theme.colors.secondary};

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  }
`;

const AchievementStar = styled.div`
  position: absolute;
  bottom: -1em;
  right: -1em;
  width: 33%;
  aspect-ratio: 1/1;
  height: auto;
  z-index: 0;
  opacity: 0.33;
  pointer-events: none;

  & > img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;
