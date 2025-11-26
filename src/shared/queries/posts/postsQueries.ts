import { useQuery } from "@tanstack/react-query";
import { postsApi, type PostData } from "./postsApi";

export const postsKeys = {
  all: ["posts"] as const,
  lists: () => [...postsKeys.all, "list"] as const,
  list: () => [...postsKeys.lists()] as const,
  detail: (id: string) => [...postsKeys.all, "detail", id] as const,
  byStatus: (status: string) =>
    [...postsKeys.all, "status", status] as const,
};

export const useGetAllPosts = () => {
  return useQuery({
    queryKey: postsKeys.list(),
    queryFn: () => postsApi.getAllPosts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetPostById = (id: string) => {
  return useQuery({
    queryKey: postsKeys.detail(id),
    queryFn: () => postsApi.getPostById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetPostsByStatus = (status: string) => {
  return useQuery({
    queryKey: postsKeys.byStatus(status),
    queryFn: () => postsApi.getPostsByStatus(status),
    enabled: !!status,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};