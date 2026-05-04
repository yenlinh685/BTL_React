import type { CategoryModel } from "~/types/categoryModel";
import type { MetaPagination } from "~/types/common";
import axiosClient from "~/utils/axiosClient";

export interface CategoryResponse {
  data: CategoryModel[];
  meta: MetaPagination;
}

export const getCategories = async (
  page: number = 1,
  per_page: number = 10
): Promise<CategoryResponse> => {
  const { data } = await axiosClient.get("/categories", {
    params: { page, per_page },
  });
  return data;
};

export const createCategory = async (payload: {
  name: string;
  key: string;
}): Promise<{ data: CategoryModel }> => {
  const { data } = await axiosClient.post("/categories", payload);
  return data;
};

export const updateCategory = async (
  id: number,
  payload: { name: string; key: string }
): Promise<{ data: CategoryModel }> => {
  const { data } = await axiosClient.put(`/categories/${id}`, payload);
  return data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await axiosClient.delete(`/categories/${id}`);
};
