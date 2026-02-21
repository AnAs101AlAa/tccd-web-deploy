import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/shared/store/hooks";
import { selectUserRole, selectIsAuthenticated } from "@/shared/store/selectors/userSelectors";
import { useVerifyToken } from "@/shared/queries/auth";
import { useEffect, useState } from "react";

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
  const [isTokenVerified, setIsTokenVerified] = useState(true);
  
  useEffect(() => {
    try {
      if (isAuthenticated) {
        verifyTokenMutation.mutate();
      }
    } catch {
      setIsTokenVerified(false);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (roles && roles.length > 0 && userRole) {
    const hasRequiredRole = roles.some(
      (role) => role.toLowerCase() === userRole.toLowerCase()
    );
    if (!hasRequiredRole && !verifyTokenMutation.isPending && !isTokenVerified) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
