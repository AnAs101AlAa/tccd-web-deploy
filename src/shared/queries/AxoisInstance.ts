import axios from "axios";

export const systemApi = axios.create({
  baseURL: "https://tccd-web-backend.runasp.net/api",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Avoid circular dependency by importing store inside the interceptor or setup function if possible.
// However, direct import is standard if no cycles exist.
import { store } from "@/shared/store/store";

systemApi.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.user.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
