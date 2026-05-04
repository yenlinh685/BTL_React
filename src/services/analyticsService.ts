import axiosClient from "~/utils/axiosClient";

export interface OverviewData {
  total_post: number;
  approved_posts: number;
  pending_posts: number;
  users: number;
  total_posts_growth_percent: number;
  approved_posts_growth_percent: number;
  pending_posts_growth_percent: number;
  users_growth_percent: number;
}

export interface LocationAnalytics {
  address: string;
  post_count: number;
  growth_rate: number;
  percentage: number;
}

export const getOverview = async (
  start_date?: string,
  end_date?: string
): Promise<{ data: OverviewData }> => {
  const { data } = await axiosClient.get("/analytics/overview", {
    params: { start_date, end_date },
  });
  return data;
};

export const getPostsLocation = async (
  start_date?: string,
  end_date?: string,
  limit: number = 10
): Promise<{ data: LocationAnalytics[] }> => {
  const { data } = await axiosClient.get("/analytics/posts/location", {
    params: { start_date, end_date, limit },
  });
  return data;
};
