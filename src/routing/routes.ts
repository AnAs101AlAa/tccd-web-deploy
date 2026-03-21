import { lazy } from "react";
import type { ComponentType, LazyExoticComponent } from "react";

// ---------- Route-level code splitting ----------
// Each page is loaded only when its route is first visited.
// Named-export pages use .then(m => ({ default: m.X })) to satisfy lazy()'s default-export requirement.
const LoginPage = lazy(() =>
  import("@/features/auth/pages/login/LoginPage").then(m => ({ default: m.LoginPage }))
);
const SignupPage = lazy(() =>
  import("@/features/auth/pages/signup/SignupPage").then(m => ({ default: m.SignupPage }))
);
const SignupConfirmation = lazy(() => import("@/features/auth/pages/signup/SignupConfirmation"));
const SignupVerification = lazy(() => import("@/features/auth/pages/signup/SignupVerification"));
const ForgotPasswordPage = lazy(() =>
  import("@/features/auth/pages/forgot-password/ForgotPasswordPage").then(m => ({ default: m.ForgotPasswordPage }))
);
const OTPPage = lazy(() =>
  import("@/features/auth/pages/otp/otp").then(m => ({ default: m.OTPPage }))
);
const ResetPasswordPage = lazy(() =>
  import("@/features/auth/pages/reset-password/ResetPasswordPage").then(m => ({ default: m.ResetPasswordPage }))
);
const HomePage = lazy(() => import("@/features/home/pages/HomePage"));
const AboutUsPage = lazy(() =>
  import("@/features/aboutus/pages/AboutUsPage").then(m => ({ default: m.AboutUsPage }))
);
const EventsPage = lazy(() => import("@/features/events/pages/EventsPage"));
const EventDetailsPage = lazy(() => import("@/features/events/pages/EventDetailsPage"));
const PastEventsPage = lazy(() => import("@/features/events/pages/PastEventsPage"));
const EventRegistrationPage = lazy(() => import("@/features/events/pages/EventRegistrationPage"));
const EventTicketPage = lazy(() => import("@/features/events/pages/EventTicketPage"));
const GalleryPage = lazy(() => import("@/features/gallery/pages/GalleryPage"));
const GalleryDisplayPage = lazy(() => import("@/features/gallery/pages/GalleryDisplayPage"));
const ProfilePage = lazy(() => import("@/features/profile/pages/ProfilePage"));
const QRScannerPage = lazy(() =>
  import("@/features/qr-scanner/pages/QRScannerPage").then(m => ({ default: m.QRScannerPage }))
);
const PostManagementPage = lazy(() =>
  import("@/features/posts/pages/PostManagementPage").then(m => ({ default: m.PostManagementPage }))
);
const PostPage = lazy(() => import("@/features/home/pages/postPage"));
const AdminEventsListPage = lazy(() => import("@/features/admin/pages/AdminEventsListPage"));
const StatisticsPage = lazy(() => import("@/features/admin/pages/StatisticsPage"));
const CompaniesPage = lazy(() => import("@/features/admin/pages/CompaniesPage"));
const LocationsManagementPage = lazy(() => import("@/features/admin/pages/LocationsManagementPage"));
const UsersAdminPage = lazy(() => import("@/features/admin/pages/UsersAdminPage"));
const RegistrationsPage = lazy(() => import("@/features/admin/pages/RegistrationsPage"));
const AIChatPage = lazy(() => import("@/features/AI/pages/AIChatPage"));

type RouteComponent = ComponentType | LazyExoticComponent<ComponentType>;

export interface Route {
  path: string;
  Component: RouteComponent;
  protected?: boolean;
  roles?: string[];
}

export const routes: Route[] = [
  { path: "/", Component: HomePage, protected: true, roles: ["all"] },
  { path: "/login", Component: LoginPage },
  { path: "/sign-up", Component: SignupPage },
  { path: "/sign-up/confirmation", Component: SignupConfirmation },
  { path: "/sign-up/verification/:token", Component: SignupVerification },
  { path: "/forgot-password", Component: ForgotPasswordPage },
  { path: "/otp", Component: OTPPage },
  { path: "/reset-password", Component: ResetPasswordPage },
  { path: "/aboutus", Component: AboutUsPage, protected: true, roles: ["all"] },
  { path: "/events/:id", Component: EventDetailsPage, protected: true, roles: ["all"] },
  { path: "/events", Component: EventsPage, protected: true, roles: ["all"] },
  { path: "/past-events", Component: PastEventsPage, protected: true, roles: ["all"] },
  { path: "/gallery", Component: GalleryPage, protected: true, roles: ["all"] },
  { path: "/owra-chat", Component: AIChatPage, protected: true, roles: ["all"] },
  {
    path: "/profile",
    Component: ProfilePage,
    protected: true,
    roles: ["student", "Volunteeringmember"],
  },
  { path: "/gallery/view/:id", Component: GalleryDisplayPage, protected: true, roles: ["all"] },
  {
    path: "/tickets/:id",
    Component: EventTicketPage,
    protected: true,
    roles: ["student", "Volunteeringmember"],
  },
  {
    path: "/scan-qr",
    Component: QRScannerPage,
    protected: true,
    roles: ["Volunteeringmember", "Admin"],
  },
  {
    path: "/posts",
    Component: PostManagementPage,
    protected: true,
    roles: ["Admin", "Volunteeringmember"],
  },
  { path: "/posts/:id", Component: PostPage, protected: true, roles: ["all"] },
  { path: "/events/register/:id", Component: EventRegistrationPage },
  {
    path: "/admin/locations",
    Component: LocationsManagementPage,
    protected: true,
    roles: ["Admin", "board"],
  },
  {
    path: "/events/register/:id",
    Component: EventRegistrationPage,
    protected: true,
    roles: ["student", "Volunteeringmember"],
  },
  {
    path: "/admin/events",
    Component: AdminEventsListPage,
    protected: true,
    roles: ["Admin", "board"],
  },
  {
    path: "/admin/statistics",
    Component: StatisticsPage,
    protected: true,
    roles: ["Admin", "board"],
  },
  {
    path: "/admin/companies",
    Component: CompaniesPage,
    protected: true,
    roles: ["Admin", "board"],
  },
  { path: "/admin/users",
    Component: UsersAdminPage,
    protected: true,
    roles: ["Admin", "board"] 
  },
  {
    path: "/admin/registrations",
    Component: RegistrationsPage,
    protected: true,
    roles: ["Admin", "board"],
  },
];
