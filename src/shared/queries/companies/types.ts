export interface Company {
  id: string;
  companyName: string;
  businessType: string;
  description: string;
  website: string;
  brief: string;
  logo: string;
}

export interface CompaniesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    items: Company[];
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export interface CompanyResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Company;
}

export interface CreateCompanyPayload {
  companyName: string;
  businessType: string;
  description: string;
  website: string;
  brief: string;
  logoId?: string;
}

export interface UpdateCompanyPayload {
  companyName?: string;
  businessType?: string;
  description?: string;
  website?: string;
  brief?: string;
  isApproved?: boolean;
  logoId?: string;
}

export interface AdminCompaniesQueryParams {
  CompanyName?: string;
  BusinessType?: string;
  OrderBy?: string;
  Descending?: boolean;
  page?: number;
  count?: number;
  isApproved?: boolean;
}
