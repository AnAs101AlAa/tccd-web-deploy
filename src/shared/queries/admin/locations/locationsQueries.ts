import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { locationsApi } from "./locationsApi";
import type {
  CreateLocationPayload,
  UpdateLocationPayload,
} from "@/shared/queries/admin/types";

export const useGetLocations = (
  pageIndex: number = 1,
  pageSize: number = 100,
  nameKey?: string,
  capacity?: number,
  orderBy?: string,
) => {
  return useQuery({
    queryKey: ["locations", pageIndex, pageSize, nameKey, capacity, orderBy],
    queryFn: () =>
      locationsApi.getLocations(
        pageIndex,
        pageSize,
        nameKey,
        capacity,
        orderBy,
      ),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLocationPayload) =>
      locationsApi.createLocation(payload),
    onSuccess: () => {
      // Invalidate and refetch locations list
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });
};

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateLocationPayload;
    }) => locationsApi.updateLocation(id, payload),
    onSuccess: () => {
      // Invalidate and refetch locations list
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });
};

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => locationsApi.deleteLocation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });
};
