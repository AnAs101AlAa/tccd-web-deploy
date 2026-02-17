import {
  LoginPage,
  SignupPage,
  SignupConfirmation,
  SignupVerification,
  ForgotPasswordPage,
  AboutUsPage,
  EventsPage,
  EventDetailsPage,
  PastEventsPage,
  GalleryPage,
  GalleryDisplayPage,
  ProfilePage,
  EventTicketPage,
  OTPPage,
  QRScannerPage,
  LocationsManagementPage,
  PostManagementPage,
  EventRegistrationPage,
  AdminEventsListPage,
  StatisticsPage,
  CompaniesPage,
  HomePage,
  PostPage,
  UsersAdminPage,
} from "@/features";

export interface Route {
  path: string;
  Component: React.ComponentType;
  protected?: boolean;
  roles?: string[];
}

export const routes: Route[] = [
  { path: "/", Component: HomePage },
  { path: "/login", Component: LoginPage },
  { path: "/sign-up", Component: SignupPage },
  { path: "/sign-up/confirmation", Component: SignupConfirmation },
  { path: "/sign-up/verification/:token", Component: SignupVerification },
  { path: "/forgot-password", Component: ForgotPasswordPage },
  { path: "/aboutus", Component: AboutUsPage },
  { path: "/events/:id", Component: EventDetailsPage },
  { path: "/events", Component: EventsPage },
  { path: "/past-events", Component: PastEventsPage },
  { path: "/gallery", Component: GalleryPage },
  {
    path: "/profile",
    Component: ProfilePage,
    protected: true,
    roles: ["student"],
  },
  { path: "/gallery/view/:id", Component: GalleryDisplayPage },
  {
    path: "/tickets/:id",
    Component: EventTicketPage,
    protected: true,
    roles: ["student"],
  },
  { path: "/otp", Component: OTPPage },
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
  { path: "/posts/:id", Component: PostPage },
  { path: "/events/register/:id", Component: EventRegistrationPage },
  { path: "/admin/events", Component: AdminEventsListPage }, // NOT A PROTECTED ROUTE, CAREFUL WITH INTEGRATION
  { path: "/admin/locations", Component: LocationsManagementPage },
  { path: "/admin/statistics", Component: StatisticsPage },
  { path: "/admin/users", Component: UsersAdminPage },
  {
    path: "/admin/locations",
    Component: LocationsManagementPage,
    protected: true,
    roles: ["Admin"],
  },
  {
    path: "/events/register/:id",
    Component: EventRegistrationPage,
    protected: true,
  },
  {
    path: "/admin/events",
    Component: AdminEventsListPage,
    protected: true,
    roles: ["Admin"],
  },
  {
    path: "/admin/statistics",
    Component: StatisticsPage,
    protected: true,
    roles: ["Admin"],
  },
  {
    path: "/admin/companies",
    Component: CompaniesPage,
    protected: true,
    roles: ["Admin"],
  },
];
