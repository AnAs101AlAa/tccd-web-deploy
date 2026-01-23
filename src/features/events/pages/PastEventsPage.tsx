import { Pagination } from "@/shared/components/pagination";
import UpperHeader from "@/shared/components/mainpages/UpperHeader";
import { pastEvents } from "../data/dummyEvents";
import WithLayout from "@/shared/components/hoc/WithLayout";
import { usePagination, useGenericFilter } from "@/shared/hooks";
import GenericGrid from "@/shared/components/GenericGrid";
import PastEventCard from "../components/PastEventCard";
import { GenericFilter } from "@/shared/components/filters";
import EVENT_TYPES from "@/constants/EventTypes";
import type Event from "@/shared/types/events";
import { LoadingPage, ErrorScreen } from "tccd-ui";
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
    categoryField: (event) => event.eventType,
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
    return <LoadingPage />;
  }

  if (error) {
    return (
      <ErrorScreen
        message="An error occurred while fetching past events. Please try again and contact our team if the problem persists."
        title="Failed to load past events"
      />
    );
  }

  return (
    <WithLayout>
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
    </WithLayout>
  );
};

export default PastEventsPage;
