import {
  PastEventCard,
  UpcomingEventCard,
  CategoryFilter,
} from "../components";
import { Pagination } from "@/shared/components/pagination";
import UpperHeader from "@/shared/components/mainpages/UpperHeader";
import { upcomingEvents, pastEvents } from "../data/dummyEvents";
import WithLayout from "@/shared/components/hoc/WithLayout";
import { usePagination, useViewAll } from "@/shared/hooks";
import ViewAllButton from "@/shared/components/pagination/ViewAllButton";
import GenericGrid from "@/shared/components/GenericGrid";
import type Event from "@/shared/types/events";
import EVENT_TYPES from "@/constants/EventTypes";
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

  const {
    selectedCategory: upcomingCategory,
    currentPage: upcomingPage,
    paginatedItems: paginatedUpcomingEvents,
    totalPages: upcomingTotalPages,
    handleCategoryChange: handleUpcomingCategoryChange,
    setPage: setUpcomingPage,
  } = usePagination<Event>({
    items: apiUpcomingEvents,
    itemsPerPageMobile: 1,
    itemsPerPageTablet: 2,
    itemsPerPageDesktop: 3,
    filterBy: (event) => event.category,
  });
  const upcomingCategories = EVENT_TYPES;

  const {
    displayedItems: displayedPastEvents,
    toggleViewAll: toggleViewAllPast,
  } = useViewAll<Event>({ items: apiPastEvents, initialLimit: 6 });

  const onBookNow = () => {
    console.log("BookNow");
  };
  const onLearnMore = () => {
    console.log("LearnMore");
  };

  if (isLoading) {
    return (
      <WithLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-contrast mx-auto mb-4"></div>
            <p className="text-lg text-secondary">Loading events...</p>
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
            <p className="text-lg text-red-600 mb-4">Failed to load events</p>
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
          title="Events"
          subtitle="Explore the catalogue of our latest and history of events on full display"
        />

        <main className="w-full xl:w-[80%] xl:mx-auto px-6 py-5">
          {/* Upcoming Events Section */}
          <section className="mb-16 bg-white rounded-lg p-6 shadow-sm">
            <div className="flex flex-row items-center justify-between gap-3 sm:gap-0 mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-contrast">
                Upcoming Events
              </h2>
            </div>

            <CategoryFilter
              categories={upcomingCategories}
              selectedCategory={upcomingCategory}
              onCategoryChange={handleUpcomingCategoryChange}
            />

            <GenericGrid
              items={paginatedUpcomingEvents}
              emptyMessage="No upcoming events at the moment. Check back soon!"
              renderCard={(event: Event) => (
                <UpcomingEventCard
                  event={event}
                  onBookNow={onBookNow}
                  onLearnMore={onLearnMore}
                />
              )}
              gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              getKey={(event: Event) => event.id}
            />

            <Pagination
              currentPage={upcomingPage}
              totalPages={upcomingTotalPages}
              onPageChange={setUpcomingPage}
            />
          </section>

          {/* Past Events Section */}
          <section className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex flex-row items-center justify-between gap-3 sm:gap-0 mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-contrast">
                Past Events
              </h2>
            </div>

            <GenericGrid
              items={displayedPastEvents}
              emptyMessage="No past events to display."
              renderCard={(event: Event) => <PastEventCard event={event} />}
              gridCols="grid-cols-1 md:grid-cols-2"
              getKey={(event: Event) => event.id}
            />

            <ViewAllButton
              onClick={() => toggleViewAllPast({ route: "/past-events" })}
            />
          </section>
        </main>
      </div>
    </WithLayout>
  );
};

export default EventsPage;
