import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App";
import { ReduxProvider } from "./shared/providers";
import { setDarkModeConfig } from "tccd-ui";

setDarkModeConfig({ enableDarkMode: false });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <ReduxProvider>
        <App />
      </ReduxProvider>
    </StrictMode>
  </QueryClientProvider>
);
