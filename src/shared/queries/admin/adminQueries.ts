import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { locationApi } from "./adminApi";
import { getDataBlob } from "@/shared/utils";
import type {
  Location,
  CreateLocationPayload,
  UpdateLocationPayload,
} from "./types";

/**
 * Dummy location data for development
 * TODO: Remove when backend integration is complete
 */
const DUMMY_LOCATIONS: Location[] = [
  {
    id: "loc-1",
    name: "Grand Conference Hall",
    capacity: 500,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
    address: "123 Main Street, Downtown, Cairo",
    description: "Large conference venue with modern facilities and excellent acoustics",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "loc-2",
    name: "Innovation Hub Auditorium",
    capacity: 300,
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800",
    address: "456 Tech Boulevard, Smart Village, Giza",
    description: "Modern auditorium equipped with cutting-edge technology for tech events",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "loc-3",
    name: "Riverside Event Center",
    capacity: 200,
    image: "https://images.unsplash.com/photo-1519167758481-83f29da8c251?w=800",
    address: "789 Nile Corniche, Maadi, Cairo",
    description: "Scenic location perfect for networking events and workshops",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "loc-4",
    name: "University Main Lecture Hall",
    capacity: 450,
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800",
    address: "Cairo University, Engineering Campus, Giza",
    description: "Classic lecture hall with tiered seating and modern AV equipment",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Query keys factory for location-related queries
 * Provides consistent cache key structure
 */
export const locationKeys = {
  all: ["locations"] as const,
  lists: () => [...locationKeys.all, "list"] as const,
  list: (filters?: string) => [...locationKeys.lists(), { filters }] as const,
  details: () => [...locationKeys.all, "detail"] as const,
  detail: (id: string) => [...locationKeys.details(), id] as const,
};

/**
 * Hook to fetch all locations
 * Converts image URLs to base64 for consistent handling
 */
export const useGetLocations = () => {
  return useQuery({
    queryKey: locationKeys.lists(),
    queryFn: async () => {
      // TODO: Replace with locationApi.getAllLocations() when backend is ready
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Convert image URLs to base64
      const locationsWithBase64Images = await Promise.all(
        DUMMY_LOCATIONS.map(async (location) => {
          try {
            const imageBase64 = await getDataBlob(location.image);
            return { ...location, image: imageBase64 };
          } catch (error) {
            console.error(`Failed to convert image for location ${location.id}:`, error);
            // Return original location if conversion fails
            return location;
          }
        })
      );
      
      return locationsWithBase64Images;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch a single location by ID
 * Converts image URL to base64 for consistent handling
 * @param id - Location identifier
 */
export const useGetLocationById = (id: string) => {
  return useQuery({
    queryKey: locationKeys.detail(id),
    queryFn: async () => {
      // TODO: Replace with locationApi.getLocationById(id) when backend is ready
      await new Promise((resolve) => setTimeout(resolve, 500));
      const location = DUMMY_LOCATIONS.find((loc) => loc.id === id);
      if (!location) {
        throw new Error("Location not found");
      }
      
      // Convert image URL to base64
      try {
        const imageBase64 = await getDataBlob(location.image);
        return { ...location, image: imageBase64 };
      } catch (error) {
        console.error(`Failed to convert image for location ${location.id}:`, error);
        // Return original location if conversion fails
        return location;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to create a new location
 * Provides optimistic updates and cache invalidation
 */
export const useCreateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateLocationPayload) => {
      // TODO: Replace with locationApi.createLocation(payload) when backend is ready
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newLocation: Location = {
        id: `loc-${Date.now()}`,
        ...payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return newLocation;
    },
    onSuccess: () => {
      // Invalidate and refetch locations list
      queryClient.invalidateQueries({ queryKey: locationKeys.lists() });
    },
  });
};

/**
 * Hook to update an existing location
 * Provides optimistic updates and cache invalidation
 */
export const useUpdateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateLocationPayload;
    }) => {
      // TODO: Replace with locationApi.updateLocation(id, payload) when backend is ready
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const existingLocation = DUMMY_LOCATIONS.find((loc) => loc.id === id);
      if (!existingLocation) {
        throw new Error("Location not found");
      }
      const updatedLocation: Location = {
        ...existingLocation,
        ...payload,
        updatedAt: new Date().toISOString(),
      };
      return updatedLocation;
    },
    onSuccess: (data) => {
      // Invalidate both list and detail queries
      queryClient.invalidateQueries({ queryKey: locationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: locationKeys.detail(data.id) });
    },
  });
};

/**
 * Hook to delete a location
 * Provides cache invalidation after successful deletion
 */
export const useDeleteLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // TODO: Replace with locationApi.deleteLocation(id) when backend is ready
      await new Promise((resolve) => setTimeout(resolve, 800));
      return id;
    },
    onSuccess: (deletedId) => {
      // Invalidate both list and detail queries
      queryClient.invalidateQueries({ queryKey: locationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: locationKeys.detail(deletedId) });
    },
  });
};
