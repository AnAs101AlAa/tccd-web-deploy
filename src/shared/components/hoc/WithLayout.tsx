import { useLocation } from "react-router-dom";
import WithNavbar from "./WithNavbar";
import WithSidebar from "./WithSidebar";

const WithLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  if (isAdminPage) {
    return <WithSidebar>{children}</WithSidebar>;
  }

  return <WithNavbar>{children}</WithNavbar>;
};

export default WithLayout;
