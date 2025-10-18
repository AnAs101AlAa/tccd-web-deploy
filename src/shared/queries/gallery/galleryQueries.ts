import { useQuery } from "@tanstack/react-query";
import { galleryApi } from "./galleryApi";

export const galleryKeys = {
  all: ["gallery"] as const,
  lists: () => [...galleryKeys.all, "list"] as const,
  list: () => [...galleryKeys.lists()] as const,
  detail: (id: string) => [...galleryKeys.all, "detail", id] as const,
  byType: (eventType: string) =>
    [...galleryKeys.all, "type", eventType] as const,
};

export const useGetAllGallery = () => {
  return useQuery({
    queryKey: galleryKeys.list(),
    queryFn: () => galleryApi.getAllGallery(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetGalleryById = (id: string) => {
  return useQuery({
    queryKey: galleryKeys.detail(id),
    queryFn: () => galleryApi.getGalleryById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetGalleryByEventType = (eventType: string) => {
  return useQuery({
    queryKey: galleryKeys.byType(eventType),
    queryFn: () => galleryApi.getGalleryByEventType(eventType),
    enabled: !!eventType,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
