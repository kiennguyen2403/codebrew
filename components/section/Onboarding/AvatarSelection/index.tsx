import { AVATAR_IMAGES } from "@/utils/constant";
import { Button, Flex, Stack, Title } from "@mantine/core";
import styled from "styled-components";
import AvatarOption from "./AvatarOption";

interface AvatarSelectionProps {
  setAvatar: (avatar: string) => void;
  selectedAvatar: string | null;
  handleSubmit: () => void;
  handleBack: () => void;
}

const AvatarSelection = ({
  setAvatar,
  selectedAvatar,
  handleSubmit,
  handleBack,
}: AvatarSelectionProps) => {
  const avatars = AVATAR_IMAGES;

  return (
    <Stack align="center">
      <AvatarScrollWrapper>
        <AvatarSelectionContainer>
          {avatars.map((avatar, index) => (
            <AvatarOption
              key={index}
              src={avatar}
              alt={`avatar-${index}`}
              selected={selectedAvatar === avatar}
              setAvatar={setAvatar}
            />
          ))}
        </AvatarSelectionContainer>
      </AvatarScrollWrapper>

      <Flex justify="center" gap={"md"} w={"100%"}>
        <Button onClick={handleBack} size="xl" variant="outline">
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          w={"fit-content"}
          size="xl"
          disabled={selectedAvatar === "" || selectedAvatar === null}
        >
          Submit
        </Button>
      </Flex>
    </Stack>
  );
};

export default AvatarSelection;

const AvatarScrollWrapper = styled.div`
  max-width: 100vw;

  overflow-x: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

const AvatarSelectionContainer = styled.div`
  width: fit-content;
  padding: 2em 5vw;
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.xl};
`;
