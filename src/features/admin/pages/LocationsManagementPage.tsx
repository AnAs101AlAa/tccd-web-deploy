import { useState, useMemo } from "react";
import { LoadingPage, ErrorScreen } from "tccd-ui";
import { useGetLocations } from "@/shared/queries/admin";
import { LocationCard, AddLocationModal } from "../components/location_card";
import { usePagination } from "@/shared/hooks";
import { Pagination } from "@/shared/components/pagination";
import GenericGrid from "@/shared/components/GenericGrid";
import LocationFilter from "../components/LocationFilter";
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
      filtered = filtered.filter(
        (location) =>
          location.name.toLowerCase().includes(search) ||
          location.address?.toLowerCase().includes(search) ||
          location.description?.toLowerCase().includes(search)
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

    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Locations Management
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Manage event locations and venues
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg font-medium"
          >
            <FiPlus className="text-xl" />
            <span>Add Location</span>
          </button>
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
          gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
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
    </div>
    </WithLayout>
  );
};

export default LocationsManagementPage;
