import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true, // gửi cookies kèm theo request
});

export default axiosClient;
