import { useState } from "react";
import { FiFilter, FiX, FiCalendar } from "react-icons/fi";
import { Button, SearchField } from "tccd-ui";
import { IoSearch } from "react-icons/io5";

export interface GenericFilterProps {
  searchKey: string;
  onSearchChange: (value: string) => void;
  selectedTypes: string[];
  onTypesChange: (types: string[]) => void;
  selectedDateRange?: { start: Date | null; end: Date | null };
  onDateRangeChange?: (range: { start: Date | null; end: Date | null }) => void;
  onSearch: () => void;
  typeOptions: Array<{ value: string; label: string }>;
  searchPlaceholder?: string;
  modalTitle?: string;
  typeLabel?: string;
}

const GenericFilter = ({
  searchKey,
  onSearchChange,
  selectedTypes,
  onTypesChange,
  selectedDateRange,
  onDateRangeChange,
  onSearch,
  typeOptions,
  searchPlaceholder = "Search...",
  modalTitle = "Filter",
  typeLabel = "Type",
}: GenericFilterProps) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [tempSelectedTypes, setTempSelectedTypes] =
    useState<string[]>(selectedTypes);
  const [tempDateRange, setTempDateRange] = useState(
    selectedDateRange || { start: null, end: null }
  );

  const handleSearchInput = (val: string) => {
    onSearchChange(val);
  };

  const toggleType = (type: string) => {
    setTempSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleApplyFilters = () => {
    onTypesChange(tempSelectedTypes);
    if (onDateRangeChange) {
      onDateRangeChange(tempDateRange);
    }
    setIsFilterModalOpen(false);
    onSearch();
  };

  const handleClearFilters = () => {
    setTempSelectedTypes([]);
    setTempDateRange({ start: null, end: null });
    onTypesChange([]);
    if (onDateRangeChange) {
      onDateRangeChange({ start: null, end: null });
    }
    setIsFilterModalOpen(false);
    onSearch();
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  const parseDate = (dateString: string): Date | null => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  const activeFiltersCount =
    selectedTypes.length +
    (selectedDateRange?.start || selectedDateRange?.end ? 1 : 0);

  return (
    <>
      <div className="w-full bg-white p-4 rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Input - Full width on mobile and desktop */}
          <SearchField
            value={searchKey}
            onChange={(val) => handleSearchInput(val)}
            placeholder={searchPlaceholder}
            className="max-w-[750px] flex-1"
          />

          {/* Buttons Container - Side by side on mobile and desktop */}
          <div className="flex gap-3 items-center w-full md:w-auto">
            <div className="relative flex-1 md:flex-initial">
              <Button
                buttonText="Categories"
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
            <span className="text-sm font-medium text-gray-600">Filters:</span>
            {selectedTypes.map((type) => (
              <div
                key={type}
                className="flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium"
              >
                <span>
                  {typeOptions.find((t) => t.value === type)?.label || type}
                </span>
                <button
                  onClick={() => {
                    const newTypes = selectedTypes.filter((t) => t !== type);
                    onTypesChange(newTypes);
                    onSearch();
                  }}
                  className="ml-1 hover:bg-secondary/20 rounded-full p-0.5"
                >
                  <FiX className="text-xs" />
                </button>
              </div>
            ))}
            {(selectedDateRange?.start || selectedDateRange?.end) && (
              <div className="flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium">
                <FiCalendar className="text-xs" />
                <span>
                  {selectedDateRange?.start
                    ? formatDate(selectedDateRange.start)
                    : "Start"}{" "}
                  -{" "}
                  {selectedDateRange?.end
                    ? formatDate(selectedDateRange.end)
                    : "End"}
                </span>
                <button
                  onClick={() => {
                    if (onDateRangeChange) {
                      onDateRangeChange({ start: null, end: null });
                      onSearch();
                    }
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
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800">{modalTitle}</h3>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="text-2xl text-gray-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FiFilter className="text-primary" />
                  {typeLabel}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {typeOptions.map((option) => {
                    const isSelected = tempSelectedTypes.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        onClick={() => toggleType(option.value)}
                        className={`px-4 py-3 rounded-xl border-2 font-medium transition-all ${
                          isSelected
                            ? "border-primary bg-primary text-white shadow-md"
                            : "border-gray-200 bg-white text-gray-700 hover:border-primary/50 hover:bg-primary/5"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {onDateRangeChange && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FiCalendar className="text-primary" />
                    Date Range
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={formatDate(tempDateRange.start)}
                        onChange={(e) =>
                          setTempDateRange((prev) => ({
                            ...prev,
                            start: parseDate(e.target.value),
                          }))
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={formatDate(tempDateRange.end)}
                        onChange={(e) =>
                          setTempDateRange((prev) => ({
                            ...prev,
                            end: parseDate(e.target.value),
                          }))
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 p-6 border-t border-gray-200 bg-gray-50">
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

export default GenericFilter;
