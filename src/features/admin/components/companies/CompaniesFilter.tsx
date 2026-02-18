import { useState } from "react";
import { FiX } from "react-icons/fi";
import { Button, SearchField } from "tccd-ui";
import { IoSearch } from "react-icons/io5";

export interface CompaniesFilterProps {
  searchKey: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  businessType: string;
  onBusinessTypeChange: (value: string) => void;
  approvalStatus: string;
  onApprovalStatusChange: (value: string) => void;
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
  searchPlaceholder = "Search by company name...",
}: CompaniesFilterProps) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [tempBusinessType, setTempBusinessType] = useState(businessType);
  const [tempApprovalStatus, setTempApprovalStatus] = useState(approvalStatus);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  const handleApplyFilters = () => {
    onBusinessTypeChange(tempBusinessType);
    onApprovalStatusChange(tempApprovalStatus);
    setIsFilterModalOpen(false);
    onSearch();
  };

  const handleClearFilters = () => {
    setTempBusinessType("");
    setTempApprovalStatus("");
    onBusinessTypeChange("");
    onApprovalStatusChange("");
    setIsFilterModalOpen(false);
    onSearch();
  };

  const activeFiltersCount = (businessType ? 1 : 0) + (approvalStatus ? 1 : 0);

  return (
    <>
      <div className="w-full bg-background p-4 rounded-xl shadow-sm mb-6">
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
            <span className="text-sm font-medium text-inactive-tab-text">
              Filters:
            </span>
            {businessType && (
              <div className="flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium">
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
              <div className="flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium">
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
          </div>
        )}
      </div>

      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-contrast/10">
              <h3 className="text-2xl font-bold text-contrast">
                Filter Companies
              </h3>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="p-2 hover:bg-contrast/10 rounded-lg transition-colors"
              >
                <FiX className="text-2xl text-contrast" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Business Type */}
              <div>
                <label className="block text-sm font-medium text-contrast mb-2">
                  Business Type
                </label>
                <input
                  type="text"
                  value={tempBusinessType}
                  onChange={(e) => setTempBusinessType(e.target.value)}
                  placeholder="e.g., Technology, Healthcare..."
                  className="w-full px-4 py-2.5 rounded-lg border border-contrast/20 bg-background text-contrast placeholder:text-inactive-tab-text focus:outline-none focus:ring-2 focus:ring-secondary/50"
                />
              </div>

              {/* Approval Status */}
              <div>
                <label className="block text-sm font-medium text-contrast mb-2">
                  Approval Status
                </label>
                <select
                  value={tempApprovalStatus}
                  onChange={(e) => setTempApprovalStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-contrast/20 bg-background text-contrast focus:outline-none focus:ring-2 focus:ring-secondary/50"
                >
                  <option value="">All</option>
                  <option value="true">Approved</option>
                  <option value="false">Not Approved</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 p-6 border-t border-contrast/10 bg-contrast/5">
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
