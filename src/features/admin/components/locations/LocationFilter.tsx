import { useState } from "react";
import { FiX } from "react-icons/fi";
import { Button, SearchField, NumberField } from "tccd-ui";
import { IoSearch } from "react-icons/io5";

export interface LocationFilterProps {
    searchKey: string;
    onSearchChange: (value: string) => void;
    minCapacity: string;
    onMinCapacityChange: (value: string) => void;
    onSearch: () => void;
    searchPlaceholder?: string;
}

const LocationFilter = ({
    searchKey,
    onSearchChange,
    minCapacity,
    onMinCapacityChange,
    onSearch,
    searchPlaceholder = "Search locations...",
}: LocationFilterProps) => {
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [tempMinCapacity, setTempMinCapacity] = useState(minCapacity);

    const handleSearchInput = (val: string) => {
        onSearchChange(val);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            onSearch();
        }
    };

    const handleApplyFilters = () => {
        onMinCapacityChange(tempMinCapacity);
        setIsFilterModalOpen(false);
        onSearch();
    };

    const handleClearFilters = () => {
        setTempMinCapacity("");
        onMinCapacityChange("");
        setIsFilterModalOpen(false);
        onSearch();
    };

    const activeFiltersCount = minCapacity ? 1 : 0;

    return (
        <>
            <div className="w-full bg-white p-4 rounded-xl shadow-sm mb-6">
                <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                    {/* Search Input - Full width on mobile and desktop */}
                    <div onKeyDown={handleKeyDown} className="w-full">
                        <SearchField
                            value={searchKey}
                            onChange={(val) => handleSearchInput(val)}
                            placeholder={searchPlaceholder}
                            className="max-w-[750px] flex-1"
                        />
                    </div>

                    {/* Buttons Container - Side by side on mobile and desktop */}
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
                        <span className="text-sm font-medium text-gray-600">Filters:</span>
                        {minCapacity && (
                            <div className="flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium">
                                <span>Min Capacity: {minCapacity}</span>
                                <button
                                    onClick={() => {
                                        onMinCapacityChange("");
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
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-800">
                                Filter Locations
                            </h3>
                            <button
                                onClick={() => setIsFilterModalOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <FiX className="text-2xl text-gray-600" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-2">
                                    <NumberField
                                        id={"minCapacity"}
                                        label="Minimum number of people"
                                        placeholder="0"
                                        value={tempMinCapacity}
                                        onChange={(val) => setTempMinCapacity(val.toString())}
                                        min={0}
                                        step={1}
                                    />
                                    <p className="text-xs text-gray-500 mt-2">
                                        Only show locations with capacity equal to or above this
                                        number
                                    </p>
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

export default LocationFilter;
