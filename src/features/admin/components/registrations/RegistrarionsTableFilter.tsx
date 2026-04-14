import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { Button, SearchField } from "tccd-ui";
import { IoSearch } from "react-icons/io5";

export interface RegistrationsTableFilterParams {
  englishName?: string;
  arabicName?: string;
  email?: string;
  university?: string;
  department?: string;
  graduationYear?: number;
}

export interface RegistrationsTableFilterProps {
  searchParams: RegistrationsTableFilterParams;
  onSearch: (params: RegistrationsTableFilterParams) => void;
}

const RegistrationsTableFilter = ({ searchParams, onSearch }: RegistrationsTableFilterProps) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [tempSelectedParams, setTempSelectedParams] = useState<RegistrationsTableFilterParams>(
    { ...searchParams }
  );

  useEffect(() => {
    setTempSelectedParams(searchParams);
  }, [searchParams]);

  // Handle name search immediately
  const handleNameSearchInput = (val: string) => {
    if (val !== "")
      onSearch({ ...searchParams, englishName: val });
    else
      onSearch({ ...searchParams, englishName: undefined });
  };

  const handleApplyFilters = () => {
    setIsFilterModalOpen(false);
    onSearch({ ...tempSelectedParams });
  };

  const handleClearFilters = () => {
    const clearedParams: RegistrationsTableFilterParams = {
      englishName: searchParams.englishName,
      arabicName: searchParams.arabicName,
      email: undefined,
      university: undefined,
      department: undefined,
      graduationYear: undefined,
    };
    setTempSelectedParams(clearedParams);
    setIsFilterModalOpen(false);
    onSearch(clearedParams);
  };

  const handleCancelModal = () => {
    setTempSelectedParams(searchParams);
    setIsFilterModalOpen(false);
  };

  const handleRemoveEmailFilter = () => {
    onSearch({ ...searchParams, email: undefined });
  };

  const handleRemoveUniversityFilter = () => {
    onSearch({ ...searchParams, university: undefined });
  };

  const handleRemoveDepartmentFilter = () => {
    onSearch({ ...searchParams, department: undefined });
  };

  const handleRemoveGraduationYearFilter = () => {
    onSearch({ ...searchParams, graduationYear: undefined });
  };

  const handleRemoveNameFilter = () => {
    onSearch({ ...searchParams, englishName: undefined });
  };

  const activeFiltersCount =
    (searchParams.englishName ? 1 : 0) +
    (searchParams.arabicName ? 1 : 0) +
    (searchParams.email ? 1 : 0) +
    (searchParams.university ? 1 : 0) +
    (searchParams.department ? 1 : 0) +
    (searchParams.graduationYear ? 1 : 0);

  return (
    <>
      <div className="w-full py-2 px-1">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search by Name - Outside Modal */}
          <SearchField
            value={searchParams.englishName || ""}
            onChange={(val) => handleNameSearchInput(val)}
            placeholder="Search by name..."
            className="max-w-[750px] flex-1"
          />

          {/* Buttons Container */}
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
                onClick={() => onSearch({ ...searchParams })}
                type="primary"
                width="full"
              />
            </div>
          </div>
        </div>

        {/* Active Filters Tags */}
        {activeFiltersCount > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm md:text-[15px] font-medium text-inactive-tab-text">
              Filters:
            </span>
            {searchParams.englishName && (
              <div className="flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm md:text-[15px] font-medium">
                <span>Name: {searchParams.englishName}</span>
                <button
                  onClick={handleRemoveNameFilter}
                  className="ml-1 hover:bg-secondary/20 rounded-full p-0.5"
                >
                  <FiX className="text-xs" />
                </button>
              </div>
            )}
            {searchParams.email && (
              <div className="flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm md:text-[15px] font-medium">
                <span>{searchParams.email}</span>
                <button
                  onClick={handleRemoveEmailFilter}
                  className="ml-1 hover:bg-secondary/20 rounded-full p-0.5"
                >
                  <FiX className="text-xs" />
                </button>
              </div>
            )}
            {searchParams.university && (
              <div className="flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm md:text-[15px] font-medium">
                <span>{searchParams.university}</span>
                <button
                  onClick={handleRemoveUniversityFilter}
                  className="ml-1 hover:bg-secondary/20 rounded-full p-0.5"
                >
                  <FiX className="text-xs" />
                </button>
              </div>
            )}
            {searchParams.department && (
              <div className="flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm md:text-[15px] font-medium">
                <span>{searchParams.department}</span>
                <button
                  onClick={handleRemoveDepartmentFilter}
                  className="ml-1 hover:bg-secondary/20 rounded-full p-0.5"
                >
                  <FiX className="text-xs" />
                </button>
              </div>
            )}
            {searchParams.graduationYear && (
              <div className="flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm md:text-[15px] font-medium">
                <span>Year: {searchParams.graduationYear}</span>
                <button
                  onClick={handleRemoveGraduationYearFilter}
                  className="ml-1 hover:bg-secondary/20 rounded-full p-0.5"
                >
                  <FiX className="text-xs" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-3 md:p-4 border-b border-gray-200">
              <h3 className="text-base md:text-2xl font-bold text-gray-800">
                Filter Registrations
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
                {/* Email */}
                <div>
                  <h4 className="text-[14px] md:text-[16px] font-semibold text-gray-800 mb-2">
                    Email
                  </h4>
                  <SearchField 
                    value={tempSelectedParams.email || ""}
                    onChange={(val) =>
                      setTempSelectedParams({
                        ...tempSelectedParams,
                        email: val || undefined,
                      })
                    }
                    placeholder="Enter Email"
                  />
                </div>
                
                {/* University */}
                <div>
                  <h4 className="text-[14px] md:text-[16px] font-semibold text-gray-800 mb-2">
                    University
                  </h4>
                  <SearchField 
                    value={tempSelectedParams.university || ""}
                    onChange={(val) =>
                      setTempSelectedParams({
                        ...tempSelectedParams,
                        university: val || undefined,
                      })
                    }
                    placeholder="Enter University"
                  />
                </div>

                {/* Department */}
                <div>
                  <h4 className="text-[14px] md:text-[16px] font-semibold text-gray-800 mb-2">
                    Department
                  </h4>
                  <SearchField 
                    value={tempSelectedParams.department || ""}
                    onChange={(val) =>
                      setTempSelectedParams({
                        ...tempSelectedParams,
                        department: val || undefined,
                      })
                    }
                    placeholder="Enter Department"
                  />
                </div>

                {/* Graduation Year */}
                <div>
                  <h4 className="text-[14px] md:text-[16px] font-semibold text-gray-800 mb-2">
                    Graduation Year
                  </h4>
                  <SearchField 
                    value={tempSelectedParams.graduationYear?.toString() || ""}
                    onChange={(val) => {
                      if (/^\d*$/.test(val)) {
                        setTempSelectedParams({
                          ...tempSelectedParams,
                          graduationYear: val ? Number(val) : undefined,
                        });
                      }
                    }}
                    placeholder="Enter Graduation Year"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
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

export default RegistrationsTableFilter;