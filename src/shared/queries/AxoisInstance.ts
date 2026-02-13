// src/shared/queries/AxoisInstance.ts
import axios from "axios";

// Function to get API base URL with fallback
const getApiBaseUrl = (): string => {
  // Try runtime config first
  if (typeof window !== 'undefined' && window.APP_CONFIG?.API_BASE_URL) {
    return window.APP_CONFIG.API_BASE_URL;
  }
  
  // Fallback to build-time env (for development)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Final fallback
  return "https://api.tccd-cufe.com/api";
};

export const systemApi = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});