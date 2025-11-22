import { LoadingPage, ErrorScreen } from "tccd-ui";
import { useGetLocations } from "@/shared/queries/admin";
import { LocationCard } from "../components/location_card";

/**
 * LocationsManagementPage Component
 * Displays a grid of location cards for admin management
 * Responsive layout that adapts to different screen sizes
 */
const LocationsManagementPage = () => {
  const { data: locations, isLoading, isError, error } = useGetLocations();

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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Locations Management
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Manage event locations and venues
          </p>
        </div>

        {/* Locations Grid */}
        {locations && locations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {locations.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No locations found
            </h3>
            <p className="text-gray-600">
              Start by adding your first location to manage events.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationsManagementPage;
