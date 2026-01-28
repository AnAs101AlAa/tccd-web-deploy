import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { MdCalendarMonth } from "react-icons/md";
import { Button, SearchField, DatePicker } from "tccd-ui";
import { IoSearch } from "react-icons/io5";
import type {
  EventQueryParams,
  EventTypes,
} from "@/shared/types";
import EVENT_TYPES from "@/constants/EventTypes";
import { DropdownMenu } from "tccd-ui";

const COMBINED_SORT_OPTIONS = [
  { value: { orderBy: "Name", descending: false }, label: "Name (A-Z)" },
  { value: { orderBy: "Name", descending: true }, label: "Name (Z-A)" },
  { value: { orderBy: "Date", descending: true }, label: "Date (Newest)" },
  { value: { orderBy: "Date", descending: false }, label: "Date (Oldest)" },
  { value: { orderBy: "Type", descending: false }, label: "Type (A-Z)" },
  { value: { orderBy: "Type", descending: true }, label: "Type (Z-A)" },
  { value: { orderBy: "Location", descending: false }, label: "Location (A-Z)" },
  { value: { orderBy: "Location", descending: true }, label: "Location (Z-A)" },
];

export interface EventsFilterProps {
  searchParams: EventQueryParams;
  onSearch: (params: EventQueryParams) => void;
  maxDate?: string;
}

const EventsFilter = ({ searchParams, onSearch, maxDate }: EventsFilterProps) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [tempSelectedParams, setTempSelectedParams] =
    useState<EventQueryParams>(searchParams);

  useEffect(() => {
    setTempSelectedParams(searchParams);
  }, [searchParams]);

  const handleSearchInput = (val: string) => {
    if(val != "")
      setTempSelectedParams({ ...tempSelectedParams, Name: val })
    else
      setTempSelectedParams({ ...tempSelectedParams, Name: undefined });
  };

  const handleApplyFilters = () => {
    const paramsToSend = {
      ...tempSelectedParams,
      StartDate: tempSelectedParams.StartDate
        ? new Date(tempSelectedParams.StartDate).toISOString()
        : undefined,
      EndDate: tempSelectedParams.EndDate
        ? new Date(tempSelectedParams.EndDate).toISOString()
        : undefined,
    };
    setIsFilterModalOpen(false);
    onSearch(paramsToSend);
  };

  const handleClearFilters = () => {
    const clearedParams = {
      ...tempSelectedParams,
      Type: undefined,
      StartDate: undefined,
      EndDate: undefined,
    };
    setTempSelectedParams(clearedParams);
    setIsFilterModalOpen(false);
    onSearch(clearedParams);
  };

  const handleCancelModal = () => {
    setTempSelectedParams(searchParams);
    setIsFilterModalOpen(false);
  };

  const handleRemoveTypeFilter = () => {
    const updatedParams = {
      ...tempSelectedParams,
      Type: undefined,
    };
    setTempSelectedParams(updatedParams);
    onSearch(updatedParams);
  };

  const handleRemoveDateFilter = () => {
    const updatedParams = {
      ...tempSelectedParams,
      StartDate: undefined,
      EndDate: undefined,
    };
    setTempSelectedParams(updatedParams);
    onSearch(updatedParams);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  const activeFiltersCount =
    (tempSelectedParams.Type ? 1 : 0) +
    (tempSelectedParams.StartDate || tempSelectedParams.EndDate ? 1 : 0);

  return (
    <>
      <div className="w-full py-2 px-1">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Input - Full width on mobile and desktop */}
          <SearchField
            value={tempSelectedParams.Name ? tempSelectedParams.Name : ""}
            onChange={(val) => handleSearchInput(val)}
            placeholder="Search events by name..."
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
                onClick={() => {
                  const paramsToSend = {
                    ...tempSelectedParams,
                    StartDate: tempSelectedParams.StartDate
                      ? new Date(tempSelectedParams.StartDate).toISOString()
                      : undefined,
                    EndDate: tempSelectedParams.EndDate
                      ? new Date(tempSelectedParams.EndDate).toISOString()
                      : undefined,
                  };
                  onSearch(paramsToSend);
                }}
                type="primary"
                width="full"
              />
            </div>
          </div>
        </div>

        {activeFiltersCount > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm md:text-[15px] font-medium text-inactive-tab-text">Filters:</span>
            {tempSelectedParams.Type && (
              <div
                key={tempSelectedParams.Type}
                className="flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm md:text-[15px] font-medium"
              >
                <span>{tempSelectedParams.Type}</span>
                <button
                  onClick={handleRemoveTypeFilter}
                  className="ml-1 hover:bg-secondary/20 rounded-full p-0.5"
                >
                  <FiX className="text-xs" />
                </button>
              </div>
            )}
            {(tempSelectedParams.StartDate || tempSelectedParams.EndDate) && (
              <div className="flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm md:text-[15px] font-medium">
                <MdCalendarMonth className="text-xs" />
                <span>
                  {tempSelectedParams.StartDate
                    ? formatDate(new Date(tempSelectedParams.StartDate))
                    : "Start"}{" "}
                  -{" "}
                  {tempSelectedParams.EndDate
                    ? formatDate(new Date(tempSelectedParams.EndDate))
                    : "End"}
                </span>
                <button
                  onClick={handleRemoveDateFilter}
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
                Filter Events
              </h3>
              <button
                onClick={handleCancelModal}
                className="p-1.5 hover:bg-gray-100 cursor-pointer rounded-full transition-colors"
              >
                <FiX className="text-2xl text-gray-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4 md:space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-[14px] md:text-[16px] font-semibold text-gray-800 mb-2">
                    Event type
                  </h4>
                  <DropdownMenu
                    label=""
                    placeholder="All"
                    options={EVENT_TYPES}
                    value={tempSelectedParams.Type}
                    onChange={(value) => {
                      if (value && EVENT_TYPES.some((t) => t.value === value)) {
                        setTempSelectedParams({
                          ...tempSelectedParams,
                          Type: value as EventTypes,
                        });
                      }
                    }}
                  />
                </div>
                <div>
                  <h4 className="text-[14px] md:text-[16px] font-semibold text-gray-800 mb-2">
                    Sort by
                  </h4>
                  <DropdownMenu
                    label=""
                    placeholder="Select sort option"
                    options={COMBINED_SORT_OPTIONS.map(opt => ({ value: JSON.stringify(opt.value), label: opt.label }))}
                    value={JSON.stringify({ orderBy: tempSelectedParams.OrderBy || "Name", descending: tempSelectedParams.Descending ?? true })}
                    onChange={(value) => {
                      try {
                        const parsed = JSON.parse(value);
                        setTempSelectedParams({
                          ...tempSelectedParams,
                          OrderBy: parsed.orderBy,
                          Descending: parsed.descending,
                        });
                      } catch {
                        // fallback: do nothing
                      }
                    }}
                  />
                </div>
              </div>
              <div>
                <h4 className="text-[14px] md:text-[16px] font-semibold text-gray-800 mt-2 mb-2 flex items-center gap-2">
                  <MdCalendarMonth className="size-4 text-primary" />
                  Date Range
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DatePicker
                    label="Start Date"
                    value={formatDate(
                      tempSelectedParams.StartDate
                        ? new Date(tempSelectedParams.StartDate)
                        : null,
                    )}
                    onChange={(date) =>
                      setTempSelectedParams({
                        ...tempSelectedParams,
                        StartDate: date || undefined,
                      })
                    }
                    maxDate={maxDate}
                  />
                  <DatePicker
                    label="End Date"
                    value={formatDate(
                      tempSelectedParams.EndDate
                        ? new Date(tempSelectedParams.EndDate)
                        : null,
                    )}
                    onChange={(date) =>
                      setTempSelectedParams({
                        ...tempSelectedParams,
                        EndDate: date || undefined,
                      })
                    }
                    maxDate={maxDate}
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
                  onClick={handleCancelModal}
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

export default EventsFilter;
