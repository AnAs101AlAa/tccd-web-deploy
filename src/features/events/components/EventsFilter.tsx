import { useState } from "react";
import { FiX, FiCalendar, FiFilter } from "react-icons/fi";
import { Button, Checkbox, SearchField } from "tccd-ui";
import { IoSearch } from "react-icons/io5";
import type {
  EventOrderBy,
  EventQueryParams,
  EventTypes,
} from "@/shared/types";
import EVENT_TYPES, { EVENT_SORT_OPTIONS } from "@/constants/EventTypes";
import { DropdownMenu } from "tccd-ui";

export interface EventsFilterProps {
  searchParams: EventQueryParams;
  onSearch: (params: EventQueryParams) => void;
  maxDate?: string; // Optional max date in YYYY-MM-DD format
}

const EventsFilter = ({ searchParams, onSearch, maxDate }: EventsFilterProps) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [tempSelectedParams, setTempSelectedParams] =
    useState<EventQueryParams>(searchParams);

  const handleSearchInput = (val: string) => {
    val != ""
      ? setTempSelectedParams({ ...tempSelectedParams, Name: val })
      : setTempSelectedParams({ ...tempSelectedParams, Name: undefined });
  };

  const handleApplyFilters = () => {
    // Convert date strings to ISO format before sending
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
    // Reset tempSelectedParams to match searchParams when canceling
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
      <div className="w-full bg-white p-4 rounded-xl shadow-sm">
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
            <span className="text-sm font-medium text-gray-600">Filters:</span>
            {tempSelectedParams.Type && (
              <div
                key={tempSelectedParams.Type}
                className="flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium"
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
              <div className="flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium">
                <FiCalendar className="text-xs" />
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
              <h3 className="txt-xl md:text-2xl font-bold text-gray-800">
                Filter Events
              </h3>
              <button
                onClick={handleCancelModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="text-2xl text-gray-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FiFilter className="text-primary" />
                    Event Type
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
                  <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FiFilter className="text-primary" />
                    Sort By
                  </h4>
                  <DropdownMenu
                    label=""
                    placeholder="None"
                    options={EVENT_SORT_OPTIONS}
                    value={tempSelectedParams.OrderBy}
                    onChange={(value) => {
                      if (
                        value &&
                        EVENT_SORT_OPTIONS.some((t) => t.value === value)
                      ) {
                        setTempSelectedParams({
                          ...tempSelectedParams,
                          OrderBy: value as EventOrderBy,
                        });
                      }
                    }}
                  />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FiFilter className="text-primary" />
                    Sort Descendingly
                  </h4>
                  <Checkbox
                    label=""
                    checked={tempSelectedParams.Descending || false}
                    onChange={() =>
                      setTempSelectedParams({
                        ...tempSelectedParams,
                        Descending: tempSelectedParams.Descending
                          ? false
                          : true,
                      })
                    }
                  />
                </div>
              </div>
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
                      max={maxDate}
                      value={formatDate(
                        tempSelectedParams.StartDate
                          ? new Date(tempSelectedParams.StartDate)
                          : null,
                      )}
                      onChange={(e) =>
                        setTempSelectedParams({
                          ...tempSelectedParams,
                          StartDate: e.target.value
                            ? e.target.value
                            : undefined,
                        })
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
                      max={maxDate}
                      value={formatDate(
                        tempSelectedParams.EndDate
                          ? new Date(tempSelectedParams.EndDate)
                          : null,
                      )}
                      onChange={(e) =>
                        setTempSelectedParams({
                          ...tempSelectedParams,
                          EndDate: e.target.value ? e.target.value : undefined,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>
              </div>
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
