import { Pagination } from "@/shared/components/pagination";
import UpperHeader from "@/shared/components/mainpages/UpperHeader";
import { galleryEvents } from "../data/dummyGallery";
import WithLayout from "@/shared/components/hoc/WithLayout";
import { usePagination, useGenericFilter } from "@/shared/hooks";
import GenericGrid from "@/shared/components/GenericGrid";
import EventGalleryCard from "../components/EventGalleryCard";
import { GenericFilter } from "@/shared/components/filters";
import EVENT_TYPES from "@/constants/EventTypes";
import type { EventGalleryCardProps } from "@/shared/types/galleyTypes";
// import { useGallery } from "../hooks";

const GalleryPage = () => {
  // ============================================
  // TODO: Uncomment when API is ready
  // ============================================
  // const {
  //   galleryItems: apiGalleryEvents,
  //   isLoading,
  //   error,
  // } = useGallery();

  // ============================================
  // Temporary: Using dummy data
  // Remove these lines when API is ready
  // ============================================
  const apiGalleryEvents = galleryEvents;
  const isLoading = false;
  const error = null;
  // ============================================

  // Gallery filtering
  const {
    searchInput,
    setSearchInput,
    handleSearch,
    selectedTypes: selectedEventTypes,
    setSelectedTypes: setSelectedEventTypes,
    selectedDateRange,
    setSelectedDateRange,
    filteredItems: filteredGallery,
  } = useGenericFilter<EventGalleryCardProps>({
    items: apiGalleryEvents,
    searchFields: (item) => [item.eventName, item.eventDescription],
    categoryField: (item) => item.eventType,
    dateField: (item) => item.eventDate,
  });

  const handleSearchWithPagination = () => {
    handleSearch();
    setPage(1);
  };

  const { currentPage, paginatedItems, totalPages, setPage } =
    usePagination<EventGalleryCardProps>({
      items: filteredGallery,
      itemsPerPageMobile: 6,
      itemsPerPageDesktop: 12,
    });

  if (isLoading) {
    return (
      <WithLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-contrast mx-auto mb-4"></div>
            <p className="text-lg text-secondary">Loading gallery...</p>
          </div>
        </div>
      </WithLayout>
    );
  }

  if (error) {
    return (
      <WithLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-red-600 mb-4">Failed to load gallery</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-contrast text-white rounded-lg hover:bg-contrast/90"
            >
              Retry
            </button>
          </div>
        </div>
      </WithLayout>
    );
  }

  return (
    <WithLayout>
      <div className="min-h-screen bg-gray-50">
        <UpperHeader
          image=""
          title="Gallery"
          subtitle="Dive into the collection of our best and brightest moments shaped by our members and community."
        />

        <main className="w-full xl:w-[80%] xl:mx-auto px-6 py-5">
          <section className="mb-16">
            <div className="mb-6">
              <GenericFilter
                searchKey={searchInput}
                onSearchChange={setSearchInput}
                selectedTypes={selectedEventTypes}
                onTypesChange={setSelectedEventTypes}
                selectedDateRange={selectedDateRange}
                onDateRangeChange={setSelectedDateRange}
                onSearch={handleSearchWithPagination}
                typeOptions={EVENT_TYPES}
                searchPlaceholder="Search gallery..."
                modalTitle="Filter Events"
                typeLabel="Event Type"
              />
            </div>

            <GenericGrid
              items={paginatedItems}
              emptyMessage="No gallery items at the moment. Check back soon!"
              renderCard={(item: EventGalleryCardProps) => (
                <EventGalleryCard {...item} />
              )}
              gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              getKey={(item: EventGalleryCardProps) => item.id}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </section>
        </main>
      </div>
    </WithLayout>
  );
};

export default GalleryPage;
