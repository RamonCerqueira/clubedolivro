import axios from "axios";
import { useAuthStore } from "../store/auth-store";

const api = axios.create({
  // Use machine IP or the actual production URL
  baseURL: "http://api.clubedolivro.clube",
});

api.interceptors.request.use(async (config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
