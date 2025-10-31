import { useState, useEffect } from "react";
import { FiFilter, FiX } from "react-icons/fi";
import { Button, SearchField } from "tccd-ui";
import { IoSearch } from "react-icons/io5";

export interface PostSearchFilterProps {
    searchKey: string;
    onSearchChange: (value: string) => void;
    selectedStatuses: string[];
    onStatusesChange: (statuses: string[]) => void;
    onSearch: () => void;
}

const POST_STATUSES = [
    { value: "posted", label: "Posted" },
    { value: "expired", label: "Expired" },
    { value: "disabled", label: "Disabled" },
];

export const PostSearchFilter = ({
    searchKey,
    onSearchChange,
    selectedStatuses,
    onStatusesChange,
    onSearch,
}: PostSearchFilterProps) => {
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [tempSelectedStatuses, setTempSelectedStatuses] = useState<string[]>(selectedStatuses);

    useEffect(() => {
        if (isFilterModalOpen) {
            setTempSelectedStatuses(selectedStatuses);
        }
    }, [isFilterModalOpen, selectedStatuses]);

    const handleSearchInput = (val: string) => {
        onSearchChange(val);
    };

    const toggleStatus = (status: string) => {
        setTempSelectedStatuses((prev) =>
            prev.includes(status)
                ? prev.filter((s) => s !== status)
                : [...prev, status]
        );
    };

    const handleClearFilters = () => {
        setTempSelectedStatuses([]);
        onStatusesChange([]);
        onSearch();
        setIsFilterModalOpen(false);
    };

    const handleDone = () => {
        onStatusesChange(tempSelectedStatuses);
        onSearch();
        setIsFilterModalOpen(false);
    };

    const activeFiltersCount = selectedStatuses.length;

    return (
        <>
            <div className="w-full bg-white p-4 rounded-xl shadow-sm">
                <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                    <SearchField
                        value={searchKey}
                        onChange={(val) => handleSearchInput(val)}
                        placeholder="Search posts..."
                        className="max-w-[750px] flex-1"
                    />

                    <div className="flex gap-3 items-center w-full md:w-auto">
                        <div className="relative flex-1 md:flex-initial">
                            <Button
                                buttonText="Status"
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
                        {selectedStatuses.map((status) => (
                            <div
                                key={status}
                                className="flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium"
                            >
                                <span>{POST_STATUSES.find((s) => s.value === status)?.label || status}</span>
                                <button
                                    onClick={() => {
                                        const newStatuses = selectedStatuses.filter((s) => s !== status);
                                        onStatusesChange(newStatuses);
                                        onSearch();
                                    }}
                                    className="ml-1 hover:bg-secondary/20 rounded-full p-0.5"
                                >
                                    <FiX className="text-xs" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isFilterModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-800">Filter Posts</h3>
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
                                    Post Status
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {POST_STATUSES.map((status) => {
                                        const isSelected = tempSelectedStatuses.includes(status.value);
                                        return (
                                            <button
                                                key={status.value}
                                                onClick={() => toggleStatus(status.value)}
                                                className={`px-4 py-3 rounded-xl border-2 font-medium transition-all ${isSelected
                                                    ? "border-primary bg-primary text-white shadow-md"
                                                    : "border-gray-200 bg-white text-gray-700 hover:border-primary/50 hover:bg-primary/5"
                                                    }`}
                                            >
                                                {status.label}
                                            </button>
                                        );
                                    })}
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
                                    onClick={() => setIsFilterModalOpen(false)}
                                    type="basic"
                                    width="auto"
                                />
                                <Button
                                    buttonText="Done"
                                    onClick={handleDone}
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

export default PostSearchFilter;