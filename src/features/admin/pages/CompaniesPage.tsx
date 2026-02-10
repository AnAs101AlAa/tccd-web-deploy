import React from "react";
import { WithLayout } from "@/shared/components/hoc";
import CompaniesTable from "../components/companies/CompaniesTable";

const CompaniesPage: React.FC = () => {
  return (
    <WithLayout>
      <div className="py-4 md:py-8 px-4 md:px-8">
        {/* Header */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-[29px] md:text-[32px] lg:text-[34px] font-bold text-contrast">
              Companies
            </h1>
            <p className="text-inactive-tab-text text-[15px] md:text-[16px] lg:text-[18px]">
              Manage and view all registered companies
            </p>
          </div>
        </div>

        {/* Table Section */}
        <section className="rounded-xl border border-contrast/10 bg-background/60 p-4 sm:p-5 lg:p-6 shadow-sm">
          <div className="flex flex-col gap-3 mb-4">
            <div>
              <h2 className="text-[22px] md:text-[23px] lg:text-[24px] font-bold text-secondary">
                All Companies
              </h2>
              <p className="text-[14px] md:text-[15px] lg:text-[16px] text-inactive-tab-text">
                Browse registered companies and their details
              </p>
            </div>
            <hr className="border-t border-gray-400/60 -mt-1 mb-1 shadow-lg" />
          </div>

          <CompaniesTable />
        </section>
      </div>
    </WithLayout>
  );
};

export default CompaniesPage;
