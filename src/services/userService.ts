import axiosClient from "~/utils/axiosClient";

export const getUserByNickname = async (nickname: string) => {
  const response = await axiosClient.get(`users/${nickname}`);
  return response.data;
};
