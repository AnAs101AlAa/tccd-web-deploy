import { LoginPage, SignupPage, SignupConfirmation, ForgotPasswordPage, AboutUsPage, EventsPage, EventDetailsPage, GalleryPage, GalleryDisplayPage , ProfilePage,
} from "@/features";

export const routes = [
  { path: "/login", Component: LoginPage },
  { path: "/sign-up", Component: SignupPage },
  { path: "/sign-up/confirmation", Component: SignupConfirmation },
  { path: "/forgot-password", Component: ForgotPasswordPage },
  { path: "/aboutus", Component: AboutUsPage },
  { path: "/events/:id", Component: EventDetailsPage },
  { path: "/events", Component: EventsPage },
  { path: "/gallery", Component: GalleryPage },
  { path: "/profile/:id", Component: ProfilePage },
  { path: "/gallery/view/:id", Component: GalleryDisplayPage }
];
