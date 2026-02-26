import { useMutation, useQuery } from "@tanstack/react-query";
import type { UserQueryParams } from "./userTypes";
import { UsersApi } from "./usersApi";

const usersApi = new UsersApi();

export function useGetUsers(params?: UserQueryParams) {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: async () => usersApi.fetchUsers(params),
  });
}

export function useGetPendingAccounts(page?: number, count?: number) {
    return useQuery({
        queryKey: ["admin", "pending-accounts", page, count],
        queryFn: async () => usersApi.fetchPendingAccounts(page, count),
    });
}

export function useApproveUser(userId: string) {
    return useMutation({
        mutationKey: ["admin", "users", "approve", userId],
        mutationFn: async () => usersApi.approveUser(userId),
    })
}

export function useRejectUser(userId: string) {
  return useMutation({
    mutationKey: ["admin", "users", "reject", userId],
    mutationFn: async () => usersApi.rejectUser(userId),
  });
}

export function useBanUser(userId: string) {
  return useMutation({
    mutationKey: ["admin", "users", "ban", userId],
    mutationFn: async () => usersApi.banUser(userId),
  });
}

export function useUnbanUser(userId: string) {
  return useMutation({
    mutationKey: ["admin", "users", "unban", userId],
    mutationFn: async () => usersApi.unbanUser(userId),
  });
}