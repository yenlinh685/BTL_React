import axiosClient from "~/utils/axiosClient";

export const login = async (email: string, password: string) => {
  const { data } = await axiosClient.post("/auth/login", {
    email,
    password,
  });
  return data;
};

export const register = async (email: string, password: string) => {
  const { data } = await axiosClient.post("/auth/register", {
    email,
    password,
  });
  return data;
};

export const logout = async () => {
  const { data } = await axiosClient.post("/auth/logout");
  return data;
};
