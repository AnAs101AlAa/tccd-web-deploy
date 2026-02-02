import { useQuery } from "@tanstack/react-query";
import { locationsApi } from "./locationsApi";

export const useGetLocations = (pageIndex: number = 1, pageSize: number = 100, nameKey?: string, capacity?: number, orderBy?: string) => {
  return useQuery({
    queryKey: ["locations", pageIndex, pageSize, nameKey, capacity, orderBy],
    queryFn: () => locationsApi.getLocations(pageIndex, pageSize, nameKey, capacity, orderBy),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
