import type { PostModel, SearchPostResponse } from "~/types/postModel";
import axiosClient from "~/utils/axiosClient";

interface PostResponse {
  data: PostModel[];
}

export const searchPosts = async (q: string): Promise<SearchPostResponse> => {
  const { data } = await axiosClient.get("/posts/search", {
    params: {
      q,
      page: 1,
      per_page: 3,
    },
  });
  return data;
};
