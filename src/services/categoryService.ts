import axiosClient from "~/utils/axiosClient";
export const getCategories = async () => {
  const { data } = await axiosClient.get("/categories");
  return data;
};
