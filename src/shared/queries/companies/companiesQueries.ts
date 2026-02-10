import { useQuery } from "@tanstack/react-query";
import { companiesApi } from "./companiesApi";
import type { CompanyQueryParams } from "@/shared/types/companies";

export const useGetCompanies = (params: CompanyQueryParams) => {
  return useQuery({
    queryKey: ["companies", params.pageIndex, params.pageSize],
    queryFn: () => companiesApi.getCompanies(params),
    staleTime: 5 * 60 * 1000,
  });
};
