import { LoginPage, SignupPage, SignupConfirmation } from "@/features";
import { EventsPage } from "@/features/events";

export const routes = [
  { path: "/login", Component: LoginPage },
  { path: "/sign-up", Component: SignupPage },
  { path: "/sign-up/confirmation", Component: SignupConfirmation },
  { path: "/events", Component: EventsPage },
];
