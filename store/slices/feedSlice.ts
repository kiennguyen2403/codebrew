import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "..";
import { CreatePostData, PostData, User } from "@/utils/types";
import { DUMMY_USERS } from "@/utils/dummy";

interface FeedState {
  loading: boolean;
  error: string | null;
  posts: PostData[];
}

const initialState: FeedState = {
  loading: false,
  error: null,
  posts: [],
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    setPosts(state, action: PayloadAction<PostData[]>) {
      state.posts = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const fetchPosts = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await fetch("/api/v1/feeds");
    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }
    const data: PostData[] = await response.json();
    console.log(data);
    dispatch(setPosts(data));
  } catch (error) {
    dispatch(
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      )
    );
  } finally {
    dispatch(setLoading(false));
  }
};

export const postFeed = createAsyncThunk(
  "feed/postFeed",
  async (post: CreatePostData, { dispatch, rejectWithValue }) => {
    dispatch(setLoading(true));
    try {
      const response = await fetch("/api/v1/feeds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Failed to post feed");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const { setPosts, setLoading, setError } = feedSlice.actions;
export default feedSlice.reducer;
