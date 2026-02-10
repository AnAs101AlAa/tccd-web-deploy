import React, { useState, useCallback } from "react";
import { WithLayout } from "@/shared/components/hoc";
import { Button } from "tccd-ui";
import { MdAdd } from "react-icons/md";
import CompaniesTable from "../components/companies/CompaniesTable";
import CompaniesFilter from "../components/companies/CompaniesFilter";
import AddEditCompanyModal from "../components/companies/AddEditCompanyModal";
import type { AdminCompaniesQueryParams } from "@/shared/queries/companies";

const CompaniesPage: React.FC = () => {
  const [queryParams, setQueryParams] = useState<AdminCompaniesQueryParams>({
    page: 1,
    count: 10,
  });

  const [searchInput, setSearchInput] = useState("");
  const [businessTypeFilter, setBusinessTypeFilter] = useState("");
  const [approvalFilter, setApprovalFilter] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleSearch = useCallback(() => {
    setQueryParams((prev) => ({
      ...prev,
      page: 1,
      CompanyName: searchInput.trim() || undefined,
      BusinessType: businessTypeFilter.trim() || undefined,
      isApproved: approvalFilter === "" ? undefined : approvalFilter === "true",
    }));
  }, [searchInput, businessTypeFilter, approvalFilter]);

  const handlePageChange = useCallback((newPage: number) => {
    setQueryParams((prev) => ({ ...prev, page: newPage }));
  }, []);

  return (
    <WithLayout>
      <div className="py-4 md:py-8 px-4 md:px-8">
        {/* Header */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-[29px] md:text-[32px] lg:text-[34px] font-bold text-contrast">
              Companies Management
            </h1>
            <p className="text-inactive-tab-text text-[15px] md:text-[16px] lg:text-[18px]">
              Manage all registered companies and their details
            </p>
          </div>
          <Button
            buttonText="Add Company"
            buttonIcon={<MdAdd className="text-lg md:text-xl" />}
            type="primary"
            onClick={() => setIsAddModalOpen(true)}
          />
        </div>

        {/* Filter Bar */}
        <CompaniesFilter
          searchKey={searchInput}
          onSearchChange={setSearchInput}
          onSearch={handleSearch}
          businessType={businessTypeFilter}
          onBusinessTypeChange={setBusinessTypeFilter}
          approvalStatus={approvalFilter}
          onApprovalStatusChange={setApprovalFilter}
        />

        {/* Table Section */}
        <section className="rounded-xl border border-contrast/10 bg-background/60 p-4 sm:p-5 lg:p-6 shadow-sm">
          <div className="flex flex-col gap-3 mb-4">
            <div>
              <h2 className="text-[22px] md:text-[23px] lg:text-[24px] font-bold text-secondary">
                All Companies
              </h2>
              <p className="text-[14px] md:text-[15px] lg:text-[16px] text-inactive-tab-text">
                Browse, edit, or remove registered companies
              </p>
            </div>
            <hr className="border-t border-gray-400/60 -mt-1 mb-1 shadow-lg" />
          </div>

          <CompaniesTable
            queryParams={queryParams}
            onPageChange={handlePageChange}
          />
        </section>

        {/* Add Company Modal */}
        {isAddModalOpen && (
          <AddEditCompanyModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
          />
        )}
      </div>
    </WithLayout>
  );
};

export default CompaniesPage;
