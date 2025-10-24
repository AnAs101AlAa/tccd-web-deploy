import { LoginPage, SignupPage, SignupConfirmation, AboutUsPage, EventsPage, GalleryPage, GalleryDisplayPage , ProfilePage, EventTicketPage
} from "@/features";

export const routes = [
  { path: "/login", Component: LoginPage },
  { path: "/sign-up", Component: SignupPage },
  { path: "/sign-up/confirmation", Component: SignupConfirmation },
  { path: "/aboutus", Component: AboutUsPage },
  { path: "/events", Component: EventsPage },
  { path: "/gallery", Component: GalleryPage },
  { path: "/profile/:id", Component: ProfilePage },
  { path: "/gallery/view/:id", Component: GalleryDisplayPage },
  { path: "/tickets/:id", Component: EventTicketPage },
];
