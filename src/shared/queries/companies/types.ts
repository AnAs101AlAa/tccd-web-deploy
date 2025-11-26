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
