import { systemApi } from "../../AxoisInstance";
import type {
  CompaniesResponse,
  CompanyResponse,
  CreateCompanyPayload,
  UpdateCompanyPayload,
} from "./types";

const COMPANIES_ROUTE = "/v1/Companies";

export class CompaniesApi {
  // ── Public endpoints ──────────────────────────────────────

  async getCompanies(
    page: number = 1,
    count: number = 10,
    companyName?: string,
    businessType?: string,
    isApproved?: boolean,
    orderBy?: string,
    descending?: boolean,
  ): Promise<CompaniesResponse> {
    const queryParams: Record<string, string | number | boolean | undefined> = {
      page,
      count,
      ...(companyName ? { CompanyName: companyName } : {}),
      ...(businessType ? { BusinessType: businessType } : {}),
      ...(isApproved !== undefined ? { IsApproved: isApproved } : {}),
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
    const { data } = await systemApi.put<CompanyResponse>(
      `${COMPANIES_ROUTE}/${id}`,
      payload,
    );
    return data;
  }

  async deleteCompany(id: string): Promise<void> {
    await systemApi.delete(`${COMPANIES_ROUTE}/${id}`);
  }
}

export const companiesApi = new CompaniesApi();
