import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthApi } from "./authApi";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/shared/utils";
import { useUserActions } from "@/shared/queries/user/userHooks";
import type {
  LoginCredentials,
  StudentSignupCredentials,
  BusinessRepSignupCredentials,
  FacultySignupCredentials,
  ForgotPasswordCredentials,
} from "./types";
import type { AnyUser } from "@/shared/types/users";

export const authKeys = {
  all: ["auth"] as const,
  login: () => [...authKeys.all, "login"] as const,
  logout: () => [...authKeys.all, "logout"] as const,
  signup: () => [...authKeys.all, "signup"] as const,
  forgotPassword: () => [...authKeys.all, "forgotPassword"] as const,
  resetPassword: () => [...authKeys.all, "resetPassword"] as const,
};

const authApiInstance = new AuthApi();

export const useLogin = () => {
  const { login } = useUserActions();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authApiInstance.login(credentials),
    onSuccess: (user: AnyUser) => {
      login(user);
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      toast.success("Login successful!");
    },
    onError: (error: any) => {
      if(error.response?.status === 401) {
        toast.error("Invalid email or password. Please try again.");
        return;
      } else if (error.response?.status === 400) {
        toast.error("Your email is not verified yet. Please check your inbox for the verification email.");
        return;
      } else if (error.response?.status === 419) {
        window.location.href = "/banned";
        return;
      }
      
      toast.error("Login failed. Please try again.");
    },
  });
};

export const useLogout = () => {
  const { logout } = useUserActions();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => authApiInstance.logout(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: authKeys.all });
      logout();
      toast.success("Logged out successfully!");
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error);
      toast.error(message || "Logout failed. Please try again.");
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

export const useSignupStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: StudentSignupCredentials) =>
      authApiInstance.signupStudent(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      toast.success("Account created successfully!");
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error);
      toast.error(message || "Signup failed. Please try again.");
    },
  });
};

export const useSignupBusinessRep = () => {
  const { login } = useUserActions();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: BusinessRepSignupCredentials) =>
      authApiInstance.signupBusinessRep(credentials),
    onSuccess: (user: AnyUser) => {
      login(user);
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      toast.success("Account created successfully!");
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error);
      toast.error(message || "Signup failed. Please try again.");
    },
  });
};

export const useSignupFaculty = () => {
  const { login } = useUserActions();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: FacultySignupCredentials) =>
      authApiInstance.signupFaculty(credentials),
    onSuccess: (user: AnyUser) => {
      login(user);
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      toast.success("Account created successfully!");
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error);
      toast.error(message || "Signup failed. Please try again.");
    },
  });
};

export const useForgotPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: ForgotPasswordCredentials) =>
      authApiInstance.forgotPassword(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.forgotPassword() });
      toast.success("Password reset email sent! Please check your inbox.");
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error);
      toast.error(message || "Failed to send reset email. Please try again.");
    },
  });
};

export const useResetPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ password, confirmPassword }: { password: string; confirmPassword: string }) =>
      authApiInstance.resetPassword(password, confirmPassword),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.resetPassword() });
      toast.success("Password reset successfully! You can now log in.");
    },
    onError: () => {
      toast.error("Failed to reset password. Please try using another OTP before resetting.");
    },
  });
};

export const useVerifyStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string) =>
      authApiInstance.verifyStudent(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      toast.success("Email verified successfully! You can now log in.");
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error);
      toast.error(message || "Email verification failed. Please try again.");
    },
  });
};

export const useResendVerification = () => {
  return useMutation({
    mutationFn: (email: string) =>
      authApiInstance.resendVerification(email),
    onSuccess: () => {
      toast.success("Verification email resent successfully! Please check your inbox.");
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error);
      toast.error(message || "Failed to resend verification email. Please try again.");
    },
  });
};

export const useVerifyToken = () => {
  return useMutation({
    mutationFn: () =>
      authApiInstance.verifyToken(),
    // Retry only on transient errors (not auth errors)
    retry: (failureCount, error: any) => {
      // Don't retry on auth errors (401, 403)
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      // Retry up to 3 times for transient errors
      return failureCount < 3;
    },
    // Exponential backoff: 1s, 2s, 4s
    retryDelay: (attemptIndex) => Math.pow(2, attemptIndex) * 1000,
  });
};
