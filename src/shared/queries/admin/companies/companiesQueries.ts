import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { companiesApi } from "./companiesApi";
import type { CreateCompanyPayload, UpdateCompanyPayload } from "./types";

// ── Public hooks ────────────────────────────────────────────

export const useGetCompanies = (
  page: number = 1,
  count: number = 10,
  companyName?: string,
  businessType?: string,
  isApproved?: boolean,
  orderBy?: string,
  descending?: boolean,
) => {
  return useQuery({
    queryKey: [
      "companies",
      page,
      count,
      companyName,
      businessType,
      isApproved,
      orderBy,
      descending,
    ],
    queryFn: () =>
      companiesApi.getCompanies(
        page,
        count,
        companyName,
        businessType,
        isApproved,
        orderBy,
        descending,
      ),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetCompanyById = (id: string) => {
  return useQuery({
    queryKey: ["companies", id],
    queryFn: () => companiesApi.getCompanyById(id),
    enabled: !!id,
  });
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCompanyPayload) =>
      companiesApi.createCompany(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCompanyPayload;
    }) => companiesApi.updateCompany(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => companiesApi.deleteCompany(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
};
