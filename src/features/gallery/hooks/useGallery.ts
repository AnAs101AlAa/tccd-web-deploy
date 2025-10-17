import { useGetAllGallery } from "@/shared/queries/gallery";

/**
 * Custom hook to fetch gallery items
 * Returns loading states, error states, and gallery data
 */
export const useGallery = () => {
  // Fetch all gallery items
  const { data: galleryItems, isLoading, error, refetch } = useGetAllGallery();

  return {
    galleryItems: galleryItems || [],
    isLoading,
    error,
    refetch,
  };
};
