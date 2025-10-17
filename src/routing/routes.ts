import { LoginPage, SignupPage, SignupConfirmation, AboutUsPage } from "@/features";

export const routes = [
  { path: "/login", Component: LoginPage },
  { path: "/sign-up", Component: SignupPage },
  { path: "/sign-up/confirmation", Component: SignupConfirmation },
  { path: "/about-us", Component: AboutUsPage },
];
