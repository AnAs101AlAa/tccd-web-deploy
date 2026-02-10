import { systemApi } from "../AxoisInstance";
import type {
  CompaniesResponse,
  CompanyResponse,
  CreateCompanyPayload,
  UpdateCompanyPayload,
  AdminCompaniesQueryParams,
} from "./types";

const COMPANIES_ROUTE = "/v1/Companies";

export class CompaniesApi {
  // ── Public endpoints ──────────────────────────────────────

  async getCompanies(
    page: number = 1,
    count: number = 10,
    companyName?: string,
    businessType?: string,
    orderBy?: string,
    descending?: boolean,
  ): Promise<CompaniesResponse> {
    const queryParams: Record<string, any> = {
      page,
      count,
      ...(companyName ? { CompanyName: companyName } : {}),
      ...(businessType ? { BusinessType: businessType } : {}),
      ...(orderBy ? { OrderBy: orderBy } : {}),
      ...(descending !== undefined ? { Descending: descending } : {}),
    };
    const { data } = await systemApi.get<CompaniesResponse>(COMPANIES_ROUTE, {
      params: queryParams,
    });
    return data;
  }

  async getCompanyById(id: string): Promise<CompanyResponse> {
    const { data } = await systemApi.get<CompanyResponse>(
      `${COMPANIES_ROUTE}/${id}`,
    );
    return data;
  }

  async createCompany(payload: CreateCompanyPayload): Promise<CompanyResponse> {
    const { data } = await systemApi.post<CompanyResponse>(
      COMPANIES_ROUTE,
      payload,
    );
    return data;
  }

  async updateCompany(
    id: string,
    payload: UpdateCompanyPayload,
  ): Promise<CompanyResponse> {
    const { data } = await systemApi.patch<CompanyResponse>(
      `${COMPANIES_ROUTE}/${id}`,
      payload,
    );
    return data;
  }

  async deleteCompany(id: string): Promise<void> {
    await systemApi.delete(`${COMPANIES_ROUTE}/${id}`);
  }

  // ── Logo endpoints ────────────────────────────────────────

  async uploadCompanyLogo(id: string, file: File): Promise<void> {
    const formData = new FormData();
    formData.append("file", file);
    await systemApi.post(`${COMPANIES_ROUTE}/${id}/logo`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  async deleteCompanyLogo(id: string): Promise<void> {
    await systemApi.delete(`${COMPANIES_ROUTE}/${id}/logo`);
  }

  // ── Admin endpoints ───────────────────────────────────────

  async getAdminCompanies(
    params: AdminCompaniesQueryParams = {},
  ): Promise<CompaniesResponse> {
    const queryParams: Record<string, any> = {
      page: params.page ?? 1,
      count: params.count ?? 10,
      ...(params.CompanyName ? { CompanyName: params.CompanyName } : {}),
      ...(params.BusinessType ? { BusinessType: params.BusinessType } : {}),
      ...(params.OrderBy ? { OrderBy: params.OrderBy } : {}),
      ...(params.Descending !== undefined
        ? { Descending: params.Descending }
        : {}),
      ...(params.isApproved !== undefined
        ? { isApproved: params.isApproved }
        : {}),
    };
    const { data } = await systemApi.get<CompaniesResponse>(
      `${COMPANIES_ROUTE}/admin`,
      { params: queryParams },
    );
    return data;
  }

  async getAdminCompanyById(id: string): Promise<CompanyResponse> {
    const { data } = await systemApi.get<CompanyResponse>(
      `${COMPANIES_ROUTE}/admin/${id}`,
    );
    return data;
  }
}

export const companiesApi = new CompaniesApi();
