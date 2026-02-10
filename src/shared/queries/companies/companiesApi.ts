import { systemApi } from "../AxoisInstance";
import type { CompaniesResponse, CompanyQueryParams } from "../../types/companies";

const COMPANIES_ROUTE = "/v1/Companies";

export class CompaniesApi {
  async getCompanies(params: CompanyQueryParams = {}): Promise<CompaniesResponse> {
    const splitOrder = params.orderBy ? params.orderBy.split(" ") : [];
    const isDescending = splitOrder.length === 2 && splitOrder[1].toLowerCase() === "desc";


    const filteredParams = {
      page: params.pageIndex || 1,
      count: params.pageSize || 10,
      CompanyName: params.companyName,
      BusinessType: params.businessType,
      OrderBy: params.orderBy ? splitOrder[0] : undefined,
      Descending: isDescending,
    };
    
    const { data } = await systemApi.get<CompaniesResponse>(`${COMPANIES_ROUTE}`, {
      params: filteredParams,
    });
    return data;
  }
}

export const companiesApi = new CompaniesApi();
