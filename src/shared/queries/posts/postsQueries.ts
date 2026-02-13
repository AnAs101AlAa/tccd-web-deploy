import { useQuery } from "@tanstack/react-query";
import { postsApi } from "./postsApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const postsKeys = {
  all: ["posts"] as const,
  lists: () => [...postsKeys.all, "list"] as const,
  list: (page?: number, count?: number, filters?: any) => 
    [...postsKeys.lists(), page, count, filters] as const,
  detail: (id: string) => [...postsKeys.all, "detail", id] as const,
  byStatus: (status: string) =>
    [...postsKeys.all, "status", status] as const,
};

export const useGetAllPosts = (
  page: number = 1,
  count: number = 10,
  filters?: {
    name?: string;
    minPriority?: number;
    maxPriority?: number;
    orderBy?: string;
    descending?: boolean;
  }
) => {
  return useQuery({
    queryKey: postsKeys.list(page, count, filters),
    queryFn: () => postsApi.getAllPosts(page, count, filters),
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

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postData: {
      name: string;
      description: string;
      priority?: number;
    }) => postsApi.createPost(postData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsKeys.lists() });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, postData }: { postId: string; postData: { name: string; description: string; priority?: number } }) =>
      postsApi.updatePost(postId, postData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsKeys.lists() });
    }
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postsApi.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsKeys.lists() });
    },
  });
};

export const useAddPostMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, mediaFiles }: { postId: string; mediaFiles: string[] }) =>
      postsApi.addPostMedia(postId, mediaFiles),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsKeys.lists() });
    }
  });
};

export const useDeletePostMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, mediaFiles }: { postId: string; mediaFiles: string[] }) =>
      postsApi.deletePostMedia(postId, mediaFiles),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsKeys.lists() });
    }
  });
};