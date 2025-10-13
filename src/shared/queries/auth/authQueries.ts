import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthApi } from "./authApi";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/shared/utils";
import { useUserActions } from "@/shared/queries/user/userHooks";
import type { LoginCredentials, SignupCredentials } from "./types";
import type { AnyUser } from "@/shared/types/users";

export const authKeys = {
  all: ["auth"] as const,
  login: () => [...authKeys.all, "login"] as const,
  logout: () => [...authKeys.all, "logout"] as const,
  signup: () => [...authKeys.all, "signup"] as const,
};

const authApiInstance = new AuthApi();

export const useLogin = () => {
  const { login } = useUserActions();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authApiInstance.login(credentials),
    onSuccess: (data: AnyUser) => {
      login(data);
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

  return useMutation({
    mutationFn: () => authApiInstance.logout(),
    onSuccess: () => {
      logout();
      queryClient.clear();
      toast.success("Logged out successfully!");
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error);
      toast.error(message || "Logout failed. Please try again.");
    },
  });
};

export const useSignup = () => {
  const { login } = useUserActions();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: SignupCredentials) =>
      authApiInstance.signup(credentials),
    onSuccess: (data: AnyUser) => {
      login(data);
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      toast.success("Account created successfully!");
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error);
      toast.error(message || "Signup failed. Please try again.");
    },
  });
};
