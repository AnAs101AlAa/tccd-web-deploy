import { useState } from "react";
import { useGetAdminCompanies } from "@/shared/queries/companies";
import { Pagination } from "@/shared/components/pagination";
import type { AdminCompaniesQueryParams } from "@/shared/queries/companies";

const CompaniesTable = () => {
  const [queryParams, setQueryParams] = useState<AdminCompaniesQueryParams>({
    page: 1,
    count: 10,
  });

  const { data: response, isLoading } = useGetAdminCompanies(queryParams);

  const handlePageChange = (newPage: number) => {
    setQueryParams((prev) => ({ ...prev, page: newPage }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-contrast mx-auto mb-3" />
          <p className="text-secondary font-medium">Loading companies...</p>
        </div>
      </div>
    );
  }

  const companies = response?.data?.items || [];
  const paginationData = response?.data;

  if (companies.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-secondary font-semibold text-lg">
          No companies found.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-contrast/5">
            <tr>
              <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-inactive-tab-text">
                Company Name
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-inactive-tab-text">
                Business Type
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-inactive-tab-text">
                Website
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-inactive-tab-text">
                Brief
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-contrast/10">
            {companies.map((company) => (
              <tr
                key={company.id}
                className="hover:bg-contrast/5 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {company.logo && (
                      <img
                        src={company.logo}
                        alt={company.companyName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    <span className="font-medium text-contrast">
                      {company.companyName}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-contrast/10 text-contrast">
                    {company.businessType}
                  </span>
                </td>
                <td className="px-4 py-3 text-secondary">
                  {company.website ? (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline text-secondary"
                    >
                      {company.website}
                    </a>
                  ) : (
                    <span className="text-inactive-tab-text">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-secondary max-w-[250px] truncate">
                  {company.brief || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-contrast/10">
        {companies.map((company) => (
          <div key={company.id} className="p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                {company.logo && (
                  <img
                    src={company.logo}
                    alt={company.companyName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <p className="font-semibold text-contrast text-[18px]">
                  {company.companyName}
                </p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-contrast/10 text-contrast shrink-0 ml-2">
                {company.businessType}
              </span>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <span className="font-medium text-inactive-tab-text block mb-0.5">
                  Website
                </span>
                <span className="text-secondary">
                  {company.website ? (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {company.website}
                    </a>
                  ) : (
                    "—"
                  )}
                </span>
              </div>
              <div>
                <span className="font-medium text-inactive-tab-text block mb-0.5">
                  Brief
                </span>
                <span className="text-secondary">{company.brief || "—"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {paginationData && paginationData.totalPages > 1 && (
        <Pagination
          currentPage={paginationData.pageIndex}
          totalPages={paginationData.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default CompaniesTable;
