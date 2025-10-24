import { LoginPage, SignupPage, SignupConfirmation, AboutUsPage, EventsPage, GalleryPage, GalleryDisplayPage } from "@/features";
import OTP from "@/features/auth/pages/otp/otp";

export const routes = [
  { path: "/login", Component: LoginPage },
  { path: "/sign-up", Component: SignupPage },
  { path: "/sign-up/confirmation", Component: SignupConfirmation },
  { path: "/aboutus", Component: AboutUsPage },
  { path: "/events", Component: EventsPage },
  { path: "/gallery", Component: GalleryPage },
  { path: "/gallery/view/:id", Component: GalleryDisplayPage }
  { path: "/otp", Component: OTP },
];
