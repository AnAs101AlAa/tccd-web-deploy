import { useGetAllPastEvents } from "@/shared/queries/events";
import type { EventQueryParams } from "@/shared/types";

/**
 * Custom hook to fetch gallery items
 * Returns loading states, error states, and gallery data
 */
export const useGallery = (params?: EventQueryParams) => {
  // Fetch all gallery items
  const { data: galleryItems, isLoading, error, refetch } = useGetAllPastEvents(params);

  return {
    galleryItems: galleryItems,
    isLoading,
    error,
    refetch,
  };
};
