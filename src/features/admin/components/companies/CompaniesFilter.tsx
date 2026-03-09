import { useState } from "react";
import { FiX } from "react-icons/fi";
import { Button, SearchField, DropdownMenu } from "tccd-ui";
import { IoSearch } from "react-icons/io5";

const COMBINED_SORT_OPTIONS = [
  {
    value: { orderBy: "CreatedAt", descending: true },
    label: "Created Date (Newest)",
  },
  {
    value: { orderBy: "CreatedAt", descending: false },
    label: "Created Date (Oldest)",
  },
  {
    value: { orderBy: "CompanyName", descending: false },
    label: "Company Name (A-Z)",
  },
  {
    value: { orderBy: "CompanyName", descending: true },
    label: "Company Name (Z-A)",
  },
  {
    value: { orderBy: "BusinessType", descending: false },
    label: "Business Type (A-Z)",
  },
  {
    value: { orderBy: "BusinessType", descending: true },
    label: "Business Type (Z-A)",
  },
];

export interface CompaniesFilterProps {
  searchKey: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  businessType: string;
  onBusinessTypeChange: (value: string) => void;
  approvalStatus: string;
  onApprovalStatusChange: (value: string) => void;
  orderBy: string;
  onOrderByChange: (value: string) => void;
  descending: boolean;
  onDescendingChange: (value: boolean) => void;
  searchPlaceholder?: string;
}

const CompaniesFilter = ({
  searchKey,
  onSearchChange,
  onSearch,
  businessType,
  onBusinessTypeChange,
  approvalStatus,
  onApprovalStatusChange,
  orderBy,
  onOrderByChange,
  descending,
  onDescendingChange,
  searchPlaceholder = "Search by company name...",
}: CompaniesFilterProps) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [tempBusinessType, setTempBusinessType] = useState(businessType);
  const [tempApprovalStatus, setTempApprovalStatus] = useState(approvalStatus);
  const [tempOrderBy, setTempOrderBy] = useState(orderBy);
  const [tempDescending, setTempDescending] = useState(descending);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  const handleApplyFilters = () => {
    onBusinessTypeChange(tempBusinessType);
    onApprovalStatusChange(tempApprovalStatus);
    onOrderByChange(tempOrderBy);
    onDescendingChange(tempDescending);
    setIsFilterModalOpen(false);
    onSearch();
  };

  const handleClearFilters = () => {
    setTempBusinessType("");
    setTempApprovalStatus("");
    setTempOrderBy("CreatedAt");
    setTempDescending(true);
    onBusinessTypeChange("");
    onApprovalStatusChange("");
    onOrderByChange("CreatedAt");
    onDescendingChange(true);
    setIsFilterModalOpen(false);
    onSearch();
  };

  const activeFiltersCount =
    (businessType ? 1 : 0) +
    (approvalStatus ? 1 : 0) +
    (orderBy !== "CreatedAt" ? 1 : 0) +
    (!descending ? 1 : 0);

  return (
    <>
      <div className="w-full py-2 px-1 mb-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div onKeyDown={handleKeyDown} className="w-full">
            <SearchField
              value={searchKey}
              onChange={(val) => onSearchChange(val)}
              placeholder={searchPlaceholder}
              className="max-w-[750px] flex-1"
            />
          </div>

          <div className="flex gap-3 items-center w-full md:w-auto">
            <div className="relative flex-1 md:flex-initial">
              <Button
                buttonText="Filters"
                onClick={() => setIsFilterModalOpen(true)}
                type={activeFiltersCount > 0 ? "secondary" : "basic"}
                width="full"
              />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-text rounded-full text-xs font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </div>

            <div className="flex-1 md:flex-initial">
              <Button
                buttonIcon={<IoSearch className="size-3.5" />}
                buttonText="Search"
                onClick={onSearch}
                type="primary"
                width="full"
              />
            </div>
          </div>
        </div>

        {activeFiltersCount > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm md:text-[15px] font-medium text-inactive-tab-text">
              Filters:
            </span>
            {businessType && (
              <div className="flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm md:text-[15px] font-medium">
                <span>Type: {businessType}</span>
                <button
                  onClick={() => {
                    onBusinessTypeChange("");
                    onSearch();
                  }}
                  className="ml-1 hover:bg-secondary/20 rounded-full p-0.5"
                >
                  <FiX className="text-xs" />
                </button>
              </div>
            )}
            {approvalStatus && (
              <div className="flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm md:text-[15px] font-medium">
                <span>
                  {approvalStatus === "true" ? "Approved" : "Not Approved"}
                </span>
                <button
                  onClick={() => {
                    onApprovalStatusChange("");
                    onSearch();
                  }}
                  className="ml-1 hover:bg-secondary/20 rounded-full p-0.5"
                >
                  <FiX className="text-xs" />
                </button>
              </div>
            )}
            {orderBy && (
              <div className="flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm md:text-[15px] font-medium">
                <span>
                  Sort: {orderBy} ({descending ? "Desc" : "Asc"})
                </span>
                <button
                  onClick={() => {
                    onOrderByChange("CreatedAt");
                    onDescendingChange(true);
                    onSearch();
                  }}
                  className="ml-1 hover:bg-secondary/20 rounded-full p-0.5"
                >
                  <FiX className="text-xs" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-3 md:p-4 border-b border-gray-200">
              <h3 className="text-base md:text-2xl font-bold text-gray-800">
                Filter Companies
              </h3>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="p-1.5 hover:bg-gray-100 cursor-pointer rounded-full transition-colors"
              >
                <FiX className="text-2xl text-gray-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 md:space-y-6">
              <div className="space-y-4">
                {/* Business Type */}
                <div>
                  <h4 className="text-[14px] md:text-[16px] font-semibold text-gray-800 mb-2">
                    Business Type
                  </h4>
                  <input
                    type="text"
                    value={tempBusinessType}
                    onChange={(e) => setTempBusinessType(e.target.value)}
                    placeholder="e.g., Technology, Healthcare..."
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                  />
                </div>

                {/* Approval Status */}
                <div>
                  <h4 className="text-[14px] md:text-[16px] font-semibold text-gray-800 mb-2">
                    Approval Status
                  </h4>
                  <DropdownMenu
                    label=""
                    placeholder="All"
                    options={[
                      { value: "true", label: "Approved" },
                      { value: "false", label: "Not Approved" },
                    ]}
                    value={tempApprovalStatus}
                    onChange={(value) => setTempApprovalStatus(value as string)}
                  />
                </div>

                {/* Sort By */}
                <div>
                  <h4 className="text-[14px] md:text-[16px] font-semibold text-gray-800 mb-2">
                    Sort by
                  </h4>
                  <DropdownMenu
                    label=""
                    placeholder="Select sort option"
                    options={COMBINED_SORT_OPTIONS.map((opt) => ({
                      value: JSON.stringify(opt.value),
                      label: opt.label,
                    }))}
                    value={JSON.stringify({
                      orderBy: tempOrderBy || "CreatedAt",
                      descending: tempDescending ?? true,
                    })}
                    onChange={(value) => {
                      try {
                        const parsed = JSON.parse(value);
                        setTempOrderBy(parsed.orderBy);
                        setTempDescending(parsed.descending);
                      } catch {
                        // fallback: do nothing
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 py-3 px-5 border-t border-gray-200 bg-gray-50">
              <Button
                buttonText="Clear All"
                onClick={handleClearFilters}
                type="basic"
                width="auto"
              />
              <div className="flex gap-3">
                <Button
                  buttonText="Cancel"
                  onClick={() => setIsFilterModalOpen(false)}
                  type="basic"
                  width="auto"
                />
                <Button
                  buttonText="Apply Filters"
                  onClick={handleApplyFilters}
                  type="primary"
                  width="auto"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompaniesFilter;
