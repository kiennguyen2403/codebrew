import { AVATAR_IMAGES } from "@/utils/constant";
import { PostData } from "@/utils/types";
import { Box, Flex, Stack, Text } from "@mantine/core";
import Image from "next/image";
import styled from "styled-components";

interface FeedCardProps {
  post: PostData;
}

const FeedCard = ({ post }: FeedCardProps) => {
  return (
    <FeedCardWrapper>
      <AvatarProfilePic>
        <Image
          src={AVATAR_IMAGES[Math.floor(Math.random() * AVATAR_IMAGES.length)]}
          alt="profile-pic"
          width={50}
          height={50}
        />
      </AvatarProfilePic>

      <Stack w={"100%"} h={"fit-content"} bg={"white"}>
        <Box
          w={"100%"}
          h={"auto"}
          style={{
            aspectRatio: "2/1",
          }}
          bg={
            ["green", "yellow", "orange", "red"][Math.floor(Math.random() * 4)]
          }
          className="thumbnail"
        >
          {post.image_url && (
            <Image
              src={post.image_url}
              alt="post-image"
              width={300}
              height={300}
            />
          )}
        </Box>
        <Stack p={"xs"}>
          <Flex justify={"space-between"}>
            <Text size="sm" fw={700} c={"dimmed"}>
              {post.createdAt}
            </Text>
            {post.is_question && (
              <Text size="sm" fw={700} c={"red"}>
                {"Q?"}
              </Text>
            )}
          </Flex>
          <Text fw={700}>{post.content}</Text>
        </Stack>
      </Stack>
    </FeedCardWrapper>
  );
};

export default FeedCard;

const FeedCardWrapper = styled.div`
  transition: ease-in-out 0.2s;
  position: relative;
  width: 22.5%;
  &:hover {
    transform: scale(1.02);
  }

  .thumbnail {
    overflow: hidden;

    & > img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
  }
`;

const AvatarProfilePic = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 2.5em;
  height: 2.5em;

  background-color: ${({ theme }) => theme.colors.primary};
  top: 1em;
  left: 1em;
  outline: 4px solid ${({ theme }) => theme.colors.secondary};
  position: absolute;
`;
