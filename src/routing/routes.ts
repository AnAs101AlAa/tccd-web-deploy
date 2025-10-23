import { LoginPage, SignupPage, SignupConfirmation, AboutUsPage, EventsPage, EventDetailsPage, GalleryPage, GalleryDisplayPage } from "@/features";

export const routes = [
  { path: "/login", Component: LoginPage },
  { path: "/sign-up", Component: SignupPage },
  { path: "/sign-up/confirmation", Component: SignupConfirmation },
  { path: "/aboutus", Component: AboutUsPage },
  { path: "/events/:id", Component: EventDetailsPage },
  { path: "/events", Component: EventsPage },
  { path: "/gallery", Component: GalleryPage },
  { path: "/gallery/view/:id", Component: GalleryDisplayPage }
];
