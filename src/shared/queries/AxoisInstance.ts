// src/shared/queries/AxoisInstance.ts
import axios from "axios";

export const systemApi = axios.create({
  baseURL: "/api",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});