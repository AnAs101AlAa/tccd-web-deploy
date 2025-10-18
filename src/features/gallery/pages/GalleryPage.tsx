import Pagination from "@/shared/components/Pagination";
import UpperHeader from "@/shared/components/mainpages/UpperHeader";
import { galleryEvents } from "../data/dummyGallery";
import WithNavbar from "@/shared/components/hoc/WithNavbar";
import { usePagination } from "@/shared/hooks";
import GalleryGrid from "../components/GalleryGrid";
import GalleryFilter from "../components/GalleryFilter";
import type { EventGalleryCardProps } from "@/shared/types/galleyTypes";
import { useGalleryFilter } from "../hooks";
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
    selectedEventTypes,
    setSelectedEventTypes,
    selectedDateRange,
    setSelectedDateRange,
    filteredGallery,
  } = useGalleryFilter({ galleryItems: apiGalleryEvents });

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
      <WithNavbar>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-contrast mx-auto mb-4"></div>
            <p className="text-lg text-secondary">Loading gallery...</p>
          </div>
        </div>
      </WithNavbar>
    );
  }

  if (error) {
    return (
      <WithNavbar>
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
      </WithNavbar>
    );
  }

  return (
    <WithNavbar>
      <div className="min-h-screen bg-gray-50">
        <UpperHeader
          image=""
          title="Gallery"
          subtitle="Dive into the collection of our best and brightest moments shaped by our members and community."
        />

        <main className="w-[98%] md:w-[84%] lg:w-[80%] mx-auto px-6 py-5">
          <section className="mb-16">
            <div className="mb-6">
              <GalleryFilter
                searchKey={searchInput}
                onSearchChange={setSearchInput}
                selectedEventTypes={selectedEventTypes}
                onEventTypesChange={setSelectedEventTypes}
                selectedDateRange={selectedDateRange}
                onDateRangeChange={setSelectedDateRange}
                onSearch={handleSearchWithPagination}
              />
            </div>

            <GalleryGrid
              gallery={paginatedItems}
              emptyMessage="No gallery items at the moment. Check back soon!"
              gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </section>
        </main>
      </div>
    </WithNavbar>
  );
};

export default GalleryPage;
