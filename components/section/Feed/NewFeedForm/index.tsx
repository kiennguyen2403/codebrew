import { useState } from "react";
import { Stack, TextInput, Checkbox, Button } from "@mantine/core";
import { useDispatch } from "react-redux";
import { postFeed } from "@/store/slices/feedSlice";
import { CreatePostData } from "@/utils/types";
import { AppDispatch } from "@/store";

interface NewFeedFormProps {
  onSubmit: () => void;
}

const NewFeedForm = ({ onSubmit }: NewFeedFormProps) => {
  const [content, setContent] = useState("");
  const [isQuestion, setIsQuestion] = useState(false);
  const dispatch: AppDispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    const post: CreatePostData = {
      content,
      is_question: isQuestion,
    };
    dispatch(postFeed(post));
    onSubmit();
  };

  return (
    <Stack gap={"md"}>
      <TextInput
        label="Content"
        placeholder="Enter your feed content"
        value={content}
        onChange={(e) => setContent(e.currentTarget.value)}
        required
      />
      <Checkbox
        label="Is this a question?"
        checked={isQuestion}
        onChange={(e) => setIsQuestion(e.currentTarget.checked)}
      />
      <Button type="submit" onClick={handleSubmit}>
        Submit
      </Button>
    </Stack>
  );
};

export default NewFeedForm;
