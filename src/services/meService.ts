import axiosClient from "~/utils/axiosClient";

export const getCurrentUser = async () => {
  const response = await axiosClient.get("users/me");
  return response.data;
};
