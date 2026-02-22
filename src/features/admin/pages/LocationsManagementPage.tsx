import { useState, useMemo } from "react";
import { LoadingPage, ErrorScreen, Button } from "tccd-ui";
import { useGetLocations } from "@/shared/queries/admin";
import { LocationCard, AddLocationModal } from "../components/locations";
import { usePagination } from "@/shared/hooks";
import { Pagination } from "@/shared/components/pagination";
import GenericGrid from "@/shared/components/GenericGrid";
import LocationFilter from "../components/locations/LocationFilter";
import type { Location } from "@/shared/queries/admin";
import { FiPlus } from "react-icons/fi";
import { WithLayout } from "@/shared/components/hoc";

/**
 * LocationsManagementPage Component
 * Displays a grid of location cards for admin management
 * Responsive layout that adapts to different screen sizes
 */
const LocationsManagementPage = () => {
  const { data: locations, isLoading, isError, error } = useGetLocations();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [minCapacityInput, setMinCapacityInput] = useState("");
  const [minCapacity, setMinCapacity] = useState("");

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setMinCapacity(minCapacityInput);
    setPage(1);
  };

  const filteredLocations = useMemo(() => {
    let filtered = locations || [];

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((location) =>
        location.name.toLowerCase().includes(search),
      );
    }

    if (minCapacity) {
      const minCap = parseInt(minCapacity, 10);
      if (!isNaN(minCap)) {
        filtered = filtered.filter((location) => location.capacity >= minCap);
      }
    }

    return filtered;
  }, [locations, searchTerm, minCapacity]);

  const { currentPage, paginatedItems, totalPages, setPage } =
    usePagination<Location>({
      items: filteredLocations,
      itemsPerPageMobile: 6,
      itemsPerPageDesktop: 12,
    });

  if (isLoading) {
    return <LoadingPage />;
  }

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
          onSearch={handleSearch}
          searchPlaceholder="Search by name, address, or description..."
        />

        <GenericGrid
          items={paginatedItems}
          emptyMessage="No locations found. Start by adding your first location to manage events."
          renderCard={(location: Location) => (
            <LocationCard location={location} />
          )}
          gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          getKey={(location: Location) => location.id}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
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
