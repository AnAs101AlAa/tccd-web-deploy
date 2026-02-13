interface AppConfig {
  API_BASE_URL: string;
}

declare global {
  interface Window {
    APP_CONFIG: AppConfig;
  }
}

export {};