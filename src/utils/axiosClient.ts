import axios from "axios";

const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

export const get = async (path: string, options = {}) => {
  const response = await request.get(path, options);
  return response;
};

export const post = async (path: string, data = {}, options = {}) => {
  const response = await request.post(path, data, options);
  return response;
};

export const patch = async (path: string, data = {}, options = {}) => {
  const response = await request.patch(path, data, options);
  return response;
};

export const del = async (path: string, options = {}) => {
  const response = await request.delete(path, options);
  return response;
};

export default request;
