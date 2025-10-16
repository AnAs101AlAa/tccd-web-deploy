import CategoryFilter from "../components/CategoryFilter";
import EventsGrid from "../components/EventsGrid";
import PastEventCard from "../components/PastEventCard";
import Pagination from "@/shared/components/Pagination";
import UpperHeader from "@/shared/components/mainpages/UpperHeader";
import { upcomingEvents, pastEvents } from "../data/dummyEvents";
import WithNavbar from "@/shared/components/hoc/WithNavbar";
import { usePagination, useViewAll } from "@/shared/hooks";
import ViewAllButton from "@/shared/components/ViewAllButton";
import type Event from "@/shared/types/events";
// import { useEvents } from "../hooks";

const EventsPage = () => {
  // ============================================
  // TODO: Uncomment when API is ready
  // ============================================
  // const {
  //   upcomingEvents: apiUpcomingEvents,
  //   pastEvents: apiPastEvents,
  //   isLoading,
  //   error,
  // } = useEvents();

  // ============================================
  // Temporary: Using dummy data
  // Remove these lines when API is ready
  // ============================================
  const apiUpcomingEvents = upcomingEvents;
  const apiPastEvents = pastEvents;
  const isLoading = false;
  const error = null;
  // ============================================

  // Upcoming events pagination
  const {
    selectedCategory: upcomingCategory,
    currentPage: upcomingPage,
    categories: upcomingCategories,
    paginatedItems: paginatedUpcomingEvents,
    totalPages: upcomingTotalPages,
    handleCategoryChange: handleUpcomingCategoryChange,
    setPage: setUpcomingPage,
  } = usePagination<Event>({
    items: apiUpcomingEvents,
    itemsPerPageMobile: 1,
    itemsPerPageDesktop: 3,
    filterBy: (event) => event.category,
  });

  // Past events view all logic
  const {
    displayedItems: displayedPastEvents,
    hasMore: hasMorePast,
    toggleViewAll: toggleViewAllPast,
  } = useViewAll<Event>({ items: apiPastEvents, initialLimit: 6 });

  // Handle loading state
  if (isLoading) {
    return (
      <WithNavbar>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-contrast mx-auto mb-4"></div>
            <p className="text-lg text-secondary">Loading events...</p>
          </div>
        </div>
      </WithNavbar>
    );
  }

  // Handle error state
  if (error) {
    return (
      <WithNavbar>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-red-600 mb-4">Failed to load events</p>
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
          title="Events"
          subtitle="Explore the catalogue of our latest and history of events on full display"
        />

        <main className="max-w-7xl mx-auto px-6 py-5">
          {/* Upcoming Events Section */}
          <section className="mb-16">
            <div className="flex flex-row items-center justify-between gap-3 sm:gap-0 mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-contrast">
                Upcoming Events
              </h2>
            </div>

            <CategoryFilter
              categories={upcomingCategories}
              selectedCategory={upcomingCategory}
              onCategoryChange={handleUpcomingCategoryChange}
            />

            <EventsGrid
              events={paginatedUpcomingEvents}
              emptyMessage="No upcoming events at the moment. Check back soon!"
              gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            />

            <Pagination
              currentPage={upcomingPage}
              totalPages={upcomingTotalPages}
              onPageChange={setUpcomingPage}
            />
          </section>

          {/* Past Events Section */}
          <section>
            <div className="flex flex-row items-center justify-between gap-3 sm:gap-0 mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-contrast">
                Past Events
              </h2>
            </div>

            <EventsGrid
              events={displayedPastEvents}
              emptyMessage="No past events to display."
              renderCard={(event) => <PastEventCard event={event} />}
              gridCols="grid-cols-1 md:grid-cols-2"
            />

            <ViewAllButton hasMore={hasMorePast} onClick={toggleViewAllPast} />
          </section>
        </main>
      </div>
    </WithNavbar>
  );
};

export default EventsPage;
