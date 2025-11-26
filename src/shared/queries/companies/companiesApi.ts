import { systemApi } from "../AxoisInstance";
import type { CompaniesResponse } from "./types";

const COMPANIES_ROUTE = "/v1/Companies";

export class CompaniesApi {
  async getCompanies(pageIndex: number = 1, pageSize: number = 100): Promise<CompaniesResponse> {
    const { data } = await systemApi.get<CompaniesResponse>(
      `${COMPANIES_ROUTE}?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    return data;
  }
}

export const companiesApi = new CompaniesApi();
