import { Navigate, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/shared/store/hooks";
import { selectUserRole, selectIsAuthenticated } from "@/shared/store/selectors/userSelectors";
import { useVerifyToken } from "@/shared/queries/auth";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { clearUser } from "@/shared/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
  redirectTo?: string;
}

/**
 * ProtectedRoute Component
 * 
 * Wraps components that require authentication and optionally specific roles.
 * Redirects to login page if user is not authenticated or doesn't have required role.
 * 
 * @param children - The component(s) to render if authorized
 * @param roles - Array of roles allowed to access this route (optional)
 * @param redirectTo - The path to redirect to if not authorized (default: "/login")
 */
const ProtectedRoute = ({ children, roles, redirectTo = "/login" }: ProtectedRouteProps) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const userRole = useAppSelector(selectUserRole);
  const verifyTokenMutation = useVerifyToken();
  const isAllRolesAllowed = roles && roles.includes("all");

  const navigate = useNavigate();
  const dispatch = useDispatch(); 

  useEffect(() => {
    const tryToken = async () => {
      try {
        if (isAuthenticated) {
          await verifyTokenMutation.mutateAsync();
        }
      } catch{
        dispatch(clearUser());
        toast.error("Session expired. Please log in again to regain access to your account.");
        if(!isAllRolesAllowed) {
          navigate("/login");
        }
      }
    }

    tryToken();
  }, [isAuthenticated]);

  if (!isAuthenticated && !verifyTokenMutation.isPending && !isAllRolesAllowed) {
    return <Navigate to={redirectTo} replace />;
  }

  if (roles && roles.length > 0 && userRole && !verifyTokenMutation.isPending) {
    const hasRequiredRole = isAllRolesAllowed || roles.some(
      (role) => role.toLowerCase() === userRole.toLowerCase()
    );
    if (!hasRequiredRole) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
