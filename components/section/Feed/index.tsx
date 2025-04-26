import { Box, Flex, Stack, Title, Button, Text } from "@mantine/core";
import FeedCard from "./FeedCard";
import { PostData } from "@/utils/types";
import { AppDispatch } from "@/store";
import { useDispatch } from "react-redux";
import { fetchPosts } from "@/store/slices/feedSlice";
import { useEffect, useState } from "react";
import styled from "styled-components";
import NewFeedForm from "./NewFeedForm";

const Feed = () => {
  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchPosts());
  }, []);

  const [showAddNewFeed, setShowAddNewFeed] = useState(false);

  return (
    <Stack w={"100%"} h={"100%"} align="center" pos={"relative"}>
      {showAddNewFeed && (
        <NewFeedModalContainer>
          <Stack w={"100%"}>
            <Flex w={"100%"} justify={"flex-end"}>
              <Text
                fw={700}
                size="lg"
                onClick={() => setShowAddNewFeed(false)}
                style={{
                  cursor: "pointer",
                }}
              >
                {"x"}
              </Text>
            </Flex>
            <Text ta={"center"} fw={"bold"} size={"lg"}>
              {"Add New Feed"}
            </Text>
            <NewFeedForm onSubmit={() => setShowAddNewFeed(false)} />
          </Stack>
        </NewFeedModalContainer>
      )}
      <Stack w={"90vw"}>
        <Title c={"primary"} fw={700} ta={"center"}>
          What's New Around You
        </Title>
        <Box>
          <Flex miw={"80vh"} w={"100%"} wrap={"wrap"} gap={"md"} py={"xl"}>
            {DUMMY_POSTS.map((post) => (
              <FeedCard key={post.id} post={post} />
            ))}
          </Flex>
        </Box>
      </Stack>
      <AddNewFeedButton>
        {showAddNewFeed ? (
          <Button fw={700} size="lg" onClick={() => setShowAddNewFeed(false)}>
            {"Cancel"}
          </Button>
        ) : (
          <Button fw={700} size="lg" onClick={() => setShowAddNewFeed(true)}>
            {"+ Post Feed"}
          </Button>
        )}
      </AddNewFeedButton>
    </Stack>
  );
};

export default Feed;

const AddNewFeedButton = styled.div`
  position: fixed;
  bottom: 2em;
  right: 2em;
`;

const DUMMY_POSTS: PostData[] = [
  {
    id: 1,
    userId: "1",
    content: "Just planted my first tomato seeds! Excited to see them grow.",
    image_url: "",
    is_question: false,
    createdAt: "2025-04-26",
    updatedAt: "2025-04-26",
  },
  {
    id: 2,
    userId: "2",
    content: "Does anyone know how to deal with aphids on roses?",
    image_url: "",
    is_question: true,
    createdAt: "2025-04-26",
    updatedAt: "2025-04-26",
  },
  {
    id: 3,
    userId: "3",
    content: "Harvested a bunch of carrots today! So fresh and sweet.",
    image_url: "",
    is_question: false,
    createdAt: "2025-04-26",
    updatedAt: "2025-04-26",
  },
  {
    id: 4,
    userId: "4",
    content: "What's the best time to plant tulip bulbs?",
    image_url: "",
    is_question: true,
    createdAt: "2025-04-26",
    updatedAt: "2025-04-26",
  },
  {
    id: 5,
    userId: "5",
    content: "My sunflowers are finally blooming! They're so tall!",
    image_url: "",
    is_question: false,
    createdAt: "2025-04-26",
    updatedAt: "2025-04-26",
  },
  {
    id: 6,
    userId: "6",
    content: "Can anyone recommend a good organic fertilizer?",
    image_url: "",
    is_question: true,
    createdAt: "2025-04-26",
    updatedAt: "2025-04-26",
  },
  {
    id: 7,
    userId: "7",
    content: "Just built a new raised bed for my veggies. Can't wait to plant!",
    image_url: "",
    is_question: false,
    createdAt: "2025-04-26",
    updatedAt: "2025-04-26",
  },
  {
    id: 8,
    userId: "8",
    content: "How do you keep squirrels away from your garden?",
    image_url: "",
    is_question: true,
    createdAt: "2025-04-26",
    updatedAt: "2025-04-26",
  },
  {
    id: 9,
    userId: "9",
    content: "Picked my first batch of strawberries today. So delicious!",
    image_url: "",
    is_question: false,
    createdAt: "2025-04-26",
    updatedAt: "2025-04-26",
  },
];

const NewFeedModalContainer = styled.div`
  position: absolute;
  top: 25vh;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  background-color: white;
  box-shadow:
    0 0 0 4px rgba(0, 0, 0, 0.8),
    0 0 0 8px rgba(255, 255, 255, 0.8),
    0 0 0 12px rgba(0, 0, 0, 0.8);
  width: 40vw;
  padding: 2em;
`;
