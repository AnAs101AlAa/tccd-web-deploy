import { LoginPage, SignupPage, SignupConfirmation, ForgotPasswordPage, AboutUsPage, EventsPage, EventDetailsPage, EventRegistrationPage, PastEventsPage, GalleryPage, GalleryDisplayPage , ProfilePage, EventTicketPage, OTPPage
} from "@/features";
export const routes = [
  { path: "/login", Component: LoginPage },
  { path: "/sign-up", Component: SignupPage },
  { path: "/sign-up/confirmation", Component: SignupConfirmation },
  { path: "/forgot-password", Component: ForgotPasswordPage },
  { path: "/aboutus", Component: AboutUsPage },
  { path: "/events/:id", Component: EventDetailsPage },
  { path: "/events", Component: EventsPage },
  { path: "/past-events", Component: PastEventsPage },
  { path: "/gallery", Component: GalleryPage },
  { path: "/gallery/view/:id", Component: GalleryDisplayPage },
  { path: "/event-registration", Component: EventRegistrationPage }
  {}  
];
