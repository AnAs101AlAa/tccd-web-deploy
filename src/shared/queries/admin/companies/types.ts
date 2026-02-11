export interface Company {
  id: string;
  companyName: string;
  businessType: string;
  description: string;
  website: string;
  brief: string;
  logo: string | null;
  isApproved: boolean;
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
  description?: string;
  website?: string;
  brief?: string;
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

export interface CompaniesQueryParams {
  page: number;
  count: number;
  CompanyName?: string;
  BusinessType?: string;
  IsApproved?: boolean;
  OrderBy?: string;
  Descending?: boolean;
}
