import {
  useLogin,
  useLogout,
  useSignup,
} from "@/shared/queries/auth/authQueries";
import {
  useIsAuthenticated,
  useCurrentUser,
} from "@/shared/queries/user/userHooks";
import { useNavigate } from "react-router-dom";
import type { LoginFormData, SignupFormData } from "../schemas";

/**
 * Custom Auth Hook
 *
 * This hook provides a unified interface for authentication operations.
 * It combines auth queries, user state, and navigation logic.
 *
 * BENEFITS:
 * - Single source of truth for auth operations
 * - Handles navigation automatically
 * - Provides loading and error states
 * - Easy to use in components
 *
 * @example
 * const { handleLogin, isLoggingIn, loginError } = useAuth();
 *
 * const onSubmit = async (data) => {
 *   await handleLogin(data);
 *   // User will be redirected automatically
 * };
 */
export const useAuth = () => {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const currentUser = useCurrentUser();

  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const signupMutation = useSignup();

  /**
   * Handle login with form data
   * Automatically navigates to dashboard on success
   */
  const handleLogin = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data);
      navigate("/dashboard");
    } catch (error) {
      // Error is handled by the mutation's onError callback
      console.error("Login error:", error);
    }
  };

  /**
   * Handle logout
   * Automatically navigates to login page on success
   */
  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate("/login");
    } catch (error) {
      // Error is handled by the mutation's onError callback
      console.error("Logout error:", error);
    }
  };

  /**
   * Handle signup with form data
   * Automatically navigates to dashboard on success
   */
  const handleSignup = async (data: SignupFormData) => {
    try {
      await signupMutation.mutateAsync(data);
      navigate("/confirmation");
    } catch (error) {
      // Error is handled by the mutation's onError callback
      console.error("Signup error:", error);
    }
  };

  return {
    // Auth operations
    handleLogin,
    handleLogout,
    handleSignup,

    // Loading states
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isSigningUp: signupMutation.isPending,

    // Error states
    loginError: loginMutation.error,
    logoutError: logoutMutation.error,
    signupError: signupMutation.error,

    // User state
    isAuthenticated,
    currentUser,

    // Raw mutations (for advanced use cases)
    loginMutation,
    logoutMutation,
    signupMutation,
  };
};
