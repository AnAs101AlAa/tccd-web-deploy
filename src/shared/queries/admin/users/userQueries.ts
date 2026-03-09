import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UserQueryParams } from "./userTypes";
import { UsersApi } from "./usersApi";

const usersApi = new UsersApi();

const usersQueryKey = ["admin", "users"];

export function useGetUsers(params?: UserQueryParams) {
  return useQuery({
    queryKey: [...usersQueryKey, params],
    queryFn: async () => usersApi.fetchUsers(params),
  });
}

export function useGetPendingAccounts(PageNumber?: number, PageSize?: number) {
  return useQuery({
    queryKey: ["admin", "pending-accounts", PageNumber, PageSize],
    queryFn: async () => usersApi.fetchPendingAccounts(PageNumber, PageSize),
  });
}

export function useApproveUser(userId: string) {
  return useMutation({
    mutationKey: ["admin", "users", "approve", userId],
    mutationFn: async () => usersApi.approveUser(userId),
  });
}

export function useRejectUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [...usersQueryKey, "reject"],
    mutationFn: async (userId: string) => usersApi.rejectUser(userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: usersQueryKey }),
  });
}

export function useBanUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [...usersQueryKey, "ban"],
    mutationFn: async (userId: string) => usersApi.banUser(userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: usersQueryKey }),
  });
}

export function useUnbanUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [...usersQueryKey, "unban"],
    mutationFn: async (userId: string) => usersApi.unbanUser(userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: usersQueryKey }),
  });
}

