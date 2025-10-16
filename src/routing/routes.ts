import { LoginPage, SignupPage, SignupConfirmation, EventsPage, GalleryPage } from "@/features";
import path from "path";

export const routes = [
  { path: "/login", Component: LoginPage },
  { path: "/sign-up", Component: SignupPage },
  { path: "/sign-up/confirmation", Component: SignupConfirmation },
  { path: "/events", Component: EventsPage },
  { path: "/gallery", Component: GalleryPage }
];
