import axios from "axios";

export const systemApi = axios.create({
  baseURL: "https://tccd-web-backend.runasp.net/api",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
