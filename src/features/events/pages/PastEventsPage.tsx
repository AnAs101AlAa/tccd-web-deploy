import { Pagination } from "@/shared/components/pagination";
import UpperHeader from "@/shared/components/mainpages/UpperHeader";
import { pastEvents } from "../data/dummyEvents";
import WithNavbar from "@/shared/components/hoc/WithNavbar";
import { usePagination, useGenericFilter } from "@/shared/hooks";
import GenericGrid from "@/shared/components/GenericGrid";
import PastEventCard from "../components/PastEventCard";
import { GenericFilter } from "@/shared/components/filters";
import EVENT_TYPES from "@/constants/EventTypes";
import type Event from "@/shared/types/events";
// import { useEvents } from "../hooks";

const PastEventsPage = () => {
  // ============================================
  // TODO: Uncomment when API is ready
  // ============================================
  // const {
  //   pastEvents: apiPastEvents,
  //   isLoading,
  //   error,
  // } = useEvents();

  // ============================================
  // Temporary: Using dummy data
  // Remove these lines when API is ready
  // ============================================
  const apiPastEvents = pastEvents;
  const isLoading = false;
  const error = null;
  // ============================================

  // Past events filtering
  const {
    searchInput,
    setSearchInput,
    handleSearch,
    selectedTypes: selectedEventTypes,
    setSelectedTypes: setSelectedEventTypes,
    selectedDateRange,
    setSelectedDateRange,
    filteredItems: filteredEvents,
  } = useGenericFilter<Event>({
    items: apiPastEvents,
    searchFields: (event) => [event.title, event.description],
    categoryField: (event) => event.category,
    dateField: (event) => event.date,
  });

  const handleSearchWithPagination = () => {
    handleSearch();
    setPage(1);
  };

  const { currentPage, paginatedItems, totalPages, setPage } =
    usePagination<Event>({
      items: filteredEvents,
      itemsPerPageMobile: 6,
      itemsPerPageDesktop: 12,
    });

  if (isLoading) {
    return (
      <WithNavbar>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-contrast mx-auto mb-4"></div>
            <p className="text-lg text-secondary">Loading past events...</p>
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
            <p className="text-lg text-red-600 mb-4">
              Failed to load past events
            </p>
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
          title="Past Events"
          subtitle="Explore memorable moments from our previous events"
        />

        <main className="w-[98%] md:w-[84%] lg:w-[80%] mx-auto px-6 py-5">
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
                searchPlaceholder="Search past events..."
                modalTitle="Filter Events"
                typeLabel="Event Type"
              />
            </div>

            <GenericGrid
              items={paginatedItems}
              emptyMessage="No past events found. Try adjusting your filters."
              renderCard={(event: Event) => <PastEventCard event={event} />}
              gridCols="grid-cols-1 md:grid-cols-2"
              getKey={(event: Event) => event.id}
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

export default PastEventsPage;
