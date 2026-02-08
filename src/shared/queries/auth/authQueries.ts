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
};

const authApiInstance = new AuthApi();

export const useLogin = () => {
  const { login } = useUserActions();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authApiInstance.login(credentials),
    onSuccess: (user: AnyUser) => {
      console.log(user);
      login(user);
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      toast.success("Login successful!");
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error);
      toast.error(message || "Login failed. Please try again.");
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
  const { login } = useUserActions();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: StudentSignupCredentials) =>
      authApiInstance.signupStudent(credentials),
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
