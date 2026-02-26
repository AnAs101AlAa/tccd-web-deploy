import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { Button, SearchField, DropdownMenu, RadioButton } from "tccd-ui";
import { IoSearch } from "react-icons/io5";
import type {
  UserQueryParams,
  Gender,
  UserRole,
  UserStatus,
} from "@/shared/queries/admin/users/userTypes";
import {
  ROLE_OPTIONS,
  GENDER_OPTIONS,
  STATUS_OPTIONS,
} from "../../constants/userConstants";

export interface UsersFilterProps {
  searchParams: UserQueryParams;
  onSearch: (params: UserQueryParams) => void;
}

const UsersFilter = ({ searchParams, onSearch }: UsersFilterProps) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [tempSelectedParams, setTempSelectedParams] = useState<UserQueryParams>(
    { ...searchParams, page: 1 },
  );

  useEffect(() => {
    setTempSelectedParams(searchParams);
  }, [searchParams]);

  const handleSearchInput = (val: string) => {
    if (val !== "")
      setTempSelectedParams({ ...tempSelectedParams, EnglishName: val });
    else
      setTempSelectedParams({ ...tempSelectedParams, EnglishName: undefined });
  };

  const handleApplyFilters = () => {
    setIsFilterModalOpen(false);
    onSearch(tempSelectedParams);
  };

  const handleClearFilters = () => {
    const clearedParams: UserQueryParams = {
      page: tempSelectedParams.page,
      count: tempSelectedParams.count,
      Gender: undefined,
      Role: undefined,
      IsDeleted: undefined,
      EnglishName: undefined,
      ArabicName: undefined,
    };
    setTempSelectedParams(clearedParams);
    setIsFilterModalOpen(false);
    onSearch(clearedParams);
  };

  const handleCancelModal = () => {
    setTempSelectedParams(searchParams);
    setIsFilterModalOpen(false);
  };

  const handleRemoveGenderFilter = () => {
    const updatedParams = {
      ...tempSelectedParams,
      Gender: undefined,
    };
    setTempSelectedParams(updatedParams);
    onSearch(updatedParams);
  };

  const handleRemoveRoleFilter = () => {
    const updatedParams = {
      ...tempSelectedParams,
      Role: undefined,
    };
    setTempSelectedParams(updatedParams);
    onSearch(updatedParams);
  };

  const handleRemoveStatusFilter = () => {
    const updatedParams = {
      ...tempSelectedParams,
      IsDeleted: undefined,
    };
    setTempSelectedParams(updatedParams);
    onSearch(updatedParams);
  };

  const getStatusLabel = () => {
    if (tempSelectedParams.IsDeleted === true) return "Deleted Users";
    if (tempSelectedParams.IsDeleted === false) return "Active Users";
    return undefined;
  };

  const activeFiltersCount =
    (tempSelectedParams.Gender ? 1 : 0) +
    (tempSelectedParams.Role ? 1 : 0) +
    (tempSelectedParams.IsDeleted !== undefined ? 1 : 0);

  return (
    <>
      <div className="w-full py-2 px-1">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Input - Full width on mobile and desktop */}
          <SearchField
            value={
              tempSelectedParams.EnglishName
                ? tempSelectedParams.EnglishName
                : ""
            }
            onChange={(val) => handleSearchInput(val)}
            placeholder="Search users by name..."
            className="max-w-[750px] flex-1"
          />

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
                onClick={() => {
                  onSearch(tempSelectedParams);
                }}
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
            {tempSelectedParams.Gender && (
              <div
                key={`gender-${tempSelectedParams.Gender}`}
                className="flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm md:text-[15px] font-medium"
              >
                <span>{tempSelectedParams.Gender}</span>
                <button
                  onClick={handleRemoveGenderFilter}
                  className="ml-1 hover:bg-secondary/20 rounded-full p-0.5"
                >
                  <FiX className="text-xs" />
                </button>
              </div>
            )}
            {tempSelectedParams.Role && (
              <div
                key={`role-${tempSelectedParams.Role}`}
                className="flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm md:text-[15px] font-medium"
              >
                <span>
                  {ROLE_OPTIONS.find((r) => r.value === tempSelectedParams.Role)
                    ?.label || tempSelectedParams.Role}
                </span>
                <button
                  onClick={handleRemoveRoleFilter}
                  className="ml-1 hover:bg-secondary/20 rounded-full p-0.5"
                >
                  <FiX className="text-xs" />
                </button>
              </div>
            )}
            {tempSelectedParams.IsDeleted !== undefined && (
              <div className="flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm md:text-[15px] font-medium">
                <span>{getStatusLabel()}</span>
                <button
                  onClick={handleRemoveStatusFilter}
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
                Filter Users
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
                    Gender
                  </h4>
                  <DropdownMenu
                    label=""
                    placeholder="All"
                    options={GENDER_OPTIONS}
                    value={tempSelectedParams.Gender || ""}
                    onChange={(value) => {
                      if (
                        value &&
                        GENDER_OPTIONS.some((g) => g.value === value)
                      ) {
                        setTempSelectedParams({
                          ...tempSelectedParams,
                          Gender: value as Gender,
                        });
                      } else {
                        setTempSelectedParams({
                          ...tempSelectedParams,
                          Gender: undefined,
                        });
                      }
                    }}
                  />
                </div>
                <div>
                  <h4 className="text-[14px] md:text-[16px] font-semibold text-gray-800 mb-2">
                    Role
                  </h4>
                  <DropdownMenu
                    label=""
                    placeholder="All"
                    options={ROLE_OPTIONS}
                    value={tempSelectedParams.Role || ""}
                    onChange={(value) => {
                      if (
                        value &&
                        ROLE_OPTIONS.some((r) => r.value === value)
                      ) {
                        setTempSelectedParams({
                          ...tempSelectedParams,
                          Role: value as UserRole,
                        });
                      } else {
                        setTempSelectedParams({
                          ...tempSelectedParams,
                          Role: undefined,
                        });
                      }
                    }}
                  />
                </div>
                <div>
                  <h4 className="text-[14px] md:text-[16px] font-semibold text-gray-800 mb-2">
                    Status
                  </h4>
                  <DropdownMenu
                    label=""
                    placeholder="All"
                    options={STATUS_OPTIONS}
                    value={tempSelectedParams.Status || ""}
                    onChange={(value) => {
                     setTempSelectedParams({
                        ...tempSelectedParams,
                        Status: value as UserStatus,
                      });
                    }}
                  />
                </div>
                
                <div>
                  <div className="space-y-2">
                    <RadioButton
                      label="Deleted Users"
                      checked={tempSelectedParams.IsDeleted === true}
                      onChange={() =>
                        setTempSelectedParams({
                          ...tempSelectedParams,
                          IsDeleted: !tempSelectedParams.IsDeleted,
                        })
                      }
                    />
                  </div>
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

export default UsersFilter;
