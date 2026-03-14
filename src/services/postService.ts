import type { MetaPagination } from "~/types/common";
import type { PostModel, SearchPostResponse } from "~/types/postModel";
import axiosClient from "~/utils/axiosClient";

export interface PostResponse {
  data: PostModel[];
  meta: MetaPagination;
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

export const getPosts = async ({
  property_categories,
  min_price,
  max_price,
  location,
}: {
  property_categories?: string;
  min_price?: number;
  max_price?: number;
  location?: string;
}): Promise<PostResponse> => {
  const { data } = await axiosClient.get("/posts", {
    params: {
      property_categories,
      min_price,
      max_price,
      location,
    },
  });
  return data;
};

export const likePost = async (id: number) => {
  const { data } = await axiosClient.post(`/posts/${id}/like`);
  return data;
};

export const unlikePost = async (id: number) => {
  const { data } = await axiosClient.delete(`/posts/${id}/unlike`);
  return data;
};
