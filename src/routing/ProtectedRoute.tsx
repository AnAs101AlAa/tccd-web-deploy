import { Navigate, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/shared/store/hooks";
import { selectUserRole, selectIsAuthenticated, selectCurrentUser } from "@/shared/store/selectors/userSelectors";
import { useVerifyToken } from "@/shared/queries/auth";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { clearUser } from "@/shared/store";
import { isVolunteer } from "@/shared/types/users";

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
  const currentUser = useAppSelector(selectCurrentUser);
  const isAllRolesAllowed = roles && roles.includes("all");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const verifyTokenMutation = useVerifyToken();

  // Handle auth errors from TanStack Query's retry mechanism
  useEffect(() => {
    if (verifyTokenMutation.isError) {
      const error = verifyTokenMutation.error as any;
      const isAuthError = error?.response?.status === 401 || error?.response?.status === 403;
      const isTransientError = !error?.response || error?.response?.status >= 500;

      // Auth-related errors: clear session
      if (isAuthError) {
        dispatch(clearUser());
        toast.error("Session expired. Please log in again to regain access to your account.");
        if (!isAllRolesAllowed) {
          navigate("/login");
        }
      }
      // Transient errors after retries exhausted
      else if (isTransientError) {
        toast.error(
          `Connection issue: ${error?.message || "Unable to verify session"}. Please try again or refresh the page.`,
          { duration: 5000 }
        );
      }
    }
  }, [verifyTokenMutation.isError, verifyTokenMutation.error]);

  // Verify token when authenticated
  useEffect(() => {
    if (isAuthenticated && !verifyTokenMutation.isPending) {
      verifyTokenMutation.mutate();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated && !verifyTokenMutation.isPending && !isAllRolesAllowed) {
    return <Navigate to={redirectTo} replace />;
  }

  // Special logic for "board" role: check volunteer membership
  if (roles?.includes("board") && userRole === "VolunteeringMember") {
    // Check if user is a volunteer with committee affiliation (member)
    if (currentUser && isVolunteer(currentUser) && currentUser.volunteeringProfile.position === "Member") {
      toast.error("Members cannot access the board section");
      return <Navigate to="/" replace />;
    }
    // Non-member volunteers are allowed, as well as non-volunteers
  } else if (roles && roles.length > 0 && userRole && !verifyTokenMutation.isPending) {
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
