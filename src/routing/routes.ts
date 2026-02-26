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
  { path: "/", Component: HomePage, protected: true, roles: ["all"] },
  { path: "/login", Component: LoginPage },
  { path: "/sign-up", Component: SignupPage },
  { path: "/sign-up/confirmation", Component: SignupConfirmation },
  { path: "/sign-up/verification/:token", Component: SignupVerification },
  { path: "/forgot-password", Component: ForgotPasswordPage },
  { path: "/aboutus", Component: AboutUsPage, protected: true, roles: ["all"] },
  { path: "/events/:id", Component: EventDetailsPage, protected: true, roles: ["all"] },
  { path: "/events", Component: EventsPage, protected: true, roles: ["all"] },
  { path: "/past-events", Component: PastEventsPage, protected: true, roles: ["all"] },
  { path: "/gallery", Component: GalleryPage, protected: true, roles: ["all"] },
  {
    path: "/profile",
    Component: ProfilePage,
    protected: true,
    roles: ["student"],
  },
  { path: "/gallery/view/:id", Component: GalleryDisplayPage, protected: true, roles: ["all"] },
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
  { path: "/posts/:id", Component: PostPage, protected: true, roles: ["all"] },
  { path: "/events/register/:id", Component: EventRegistrationPage },
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
    roles: ["student", "Volunteeringmember"],
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
  { path: "/admin/users",
    Component: UsersAdminPage,
    protected: true,
    roles: ["Admin"] 
  },
];
