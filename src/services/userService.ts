import axiosClient from "~/utils/axiosClient";

export const updateProfile = async (data: {
  full_name: string;
  nickname: string;
  phone_number: string;
  avatar_url: string;
}) => {
  const response = await axiosClient.put(`users/me/update`, data);
  return response.data;
};

export const getUserByNickname = async (nickname: string) => {
  const response = await axiosClient.get(`users/${nickname}`);
  return response.data;
};
