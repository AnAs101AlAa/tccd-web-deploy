import { useState, useCallback } from "react";
import { ErrorScreen, Button } from "tccd-ui";
import { useGetLocations } from "@/shared/queries/admin";
import { LocationCard, AddLocationModal } from "../components/locations";
import { Pagination } from "@/shared/components/pagination";
import GenericGrid from "@/shared/components/GenericGrid";
import LocationFilter from "../components/locations/LocationFilter";
import type { Location, LocationsQueryParams } from "@/shared/queries/admin";
import { FiPlus } from "react-icons/fi";
import { WithLayout } from "@/shared/components/hoc";

/**
 * LocationsManagementPage Component
 * Displays a grid of location cards for admin management
 * Responsive layout that adapts to different screen sizes
 */
const LocationsManagementPage = () => {
  const [queryParams, setQueryParams] = useState<LocationsQueryParams>({
    PageNumber: 1,
    PageSize: 12,
    OrderBy: "Name",
    Descending: true,
  });

  const {
    data: locationsResponse,
    isLoading,
    isError,
    error,
  } = useGetLocations(queryParams);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [minCapacityInput, setMinCapacityInput] = useState("");
  const [orderByFilter, setOrderByFilter] = useState("Name");
  const [descendingFilter, setDescendingFilter] = useState(true);

  const handleSearch = useCallback(() => {
    setQueryParams((prev) => ({
      ...prev,
      PageNumber: 1,
      Name: searchInput.trim() || undefined,
      Capacity: minCapacityInput ? parseInt(minCapacityInput, 10) : undefined,
      OrderBy: orderByFilter,
      Descending: descendingFilter,
    }));
  }, [searchInput, minCapacityInput, orderByFilter, descendingFilter]);

  if (isError) {
    return (
      <ErrorScreen
        title="Error Loading Locations"
        message={
          error instanceof Error
            ? error.message
            : "Failed to load locations. Please try again."
        }
      />
    );
  }

  return (
    <WithLayout>
      <div className="py-4 md:py-8 px-4 md:px-8">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-[29px] md:text-[32px] lg:text-[34px] font-bold text-contrast">
              Locations
            </h1>
            <p className="text-inactive-tab-text text-[15px] md:text-[16px] lg:text-[18px]">
              Manage event locations and venues
            </p>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            type="primary"
            width="fit"
            buttonText="Add location"
            buttonIcon={<FiPlus className="size-4" />}
          />
        </div>

        <LocationFilter
          searchKey={searchInput}
          onSearchChange={setSearchInput}
          minCapacity={minCapacityInput}
          onMinCapacityChange={setMinCapacityInput}
          orderBy={orderByFilter}
          onOrderByChange={setOrderByFilter}
          descending={descendingFilter}
          onDescendingChange={setDescendingFilter}
          onSearch={handleSearch}
          searchPlaceholder="Search by name, address, or description..."
        />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[30vh] w-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-contrast mx-auto mb-4"></div>
              <p className="text-lg text-secondary font-medium">
                Loading locations...
              </p>
            </div>
          </div>
        ) : (
          <GenericGrid
            items={locationsResponse?.items || []}
            emptyMessage="No locations found. Start by adding your first location to manage events."
            renderCard={(location: Location) => (
              <LocationCard location={location} />
            )}
            gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            getKey={(location: Location) => location.id}
          />
        )}

        <Pagination
          currentPage={queryParams.PageNumber}
          totalPages={locationsResponse?.totalPages || 0}
          onPageChange={(page) =>
            setQueryParams((prev) => ({ ...prev, PageNumber: page }))
          }
        />

        <AddLocationModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      </div>
    </WithLayout>
  );
};

export default LocationsManagementPage;
