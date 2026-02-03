import { useQuery } from "@tanstack/react-query";
import { companiesApi } from "./companiesApi";

export const useGetCompanies = (pageIndex: number = 1, pageSize: number = 100) => {
  return useQuery({
    queryKey: ["companies", pageIndex, pageSize],
    queryFn: () => companiesApi.getCompanies(pageIndex, pageSize),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
