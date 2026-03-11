import type { MetaPagination } from "./common";

export interface PostModel {
  id: number;
  title: string;
  description: string;
  address: string;
  administrative_address: string;
  project_type: string;
  images: string;
  post_status: string;
  status: string;
  category_id: number;
  user_id: number;
  role: string;
  created_at: string;
  updated_at: string;
  json_category: unknown | null;
  json_user: unknown | null;
  json_post_detail: PostDetail;
  is_favorite: boolean;
}

export interface PostDetail {
  id: number;
  post_id: number;
  bedrooms: number | null;
  bathrooms: number | null;
  balcony: string | null;
  main_door: string | null;
  legal_documents: string | null;
  interior_status: string | null;
  area: number;
  price: string;
  deposit: string | null;
  type: string | null;
  created_at: string;
  updated_at: string;
}

export interface SearchPostResponse {
  data: PostModel[];
  meta: MetaPagination;
}
