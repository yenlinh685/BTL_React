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
  min_price?: string;
  max_price?: string;
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

export const createPost = async (data: {
  title: string;
  description: string;
  category_id: number;
  address: string;
  administrative_address: string;
  images: string;
  project_type: "rent" | "sell";
  role: "user" | "agent";
  details: {
    bedrooms: number;
    bathrooms: number;
    balcony: string;
    main_door: string;
    legal_documents: string;
    interior_status: string;
    area: number;
    price: string;
    deposit: string;
  };
}) => {
  const { data: response } = await axiosClient.post("/posts", data);
  return response;
};
