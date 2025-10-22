import {
  LoginPage,
  SignupPage,
  SignupConfirmation,
  EventsPage,
  GalleryPage,
  ProfilePage,
} from "@/features";

export const routes = [
  { path: "/login", Component: LoginPage },
  { path: "/sign-up", Component: SignupPage },
  { path: "/sign-up/confirmation", Component: SignupConfirmation },
  { path: "/events", Component: EventsPage },
  { path: "/gallery", Component: GalleryPage },
  { path: "/:username", Component: ProfilePage },
];
