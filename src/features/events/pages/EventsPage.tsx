import { PastEventCard, UpcomingEventCard } from "../components";
import { Pagination } from "@/shared/components/pagination";
import UpperHeader from "@/shared/components/mainpages/UpperHeader";
import WithLayout from "@/shared/components/hoc/WithLayout";
import GenericGrid from "@/shared/components/GenericGrid";
import type Event from "@/shared/types/events";
import { useEvents } from "../hooks";
import { useState } from "react";

const EventsPage = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const {
    upcomingEvents: apiUpcomingEvents,
    pastEvents: apiPastEvents,
    isLoading,
    error,
    refetchUpcoming,
  } = useEvents({ PageNumber: currentPage });

  // ============================================
  // Temporary: Using dummy data
  // Remove these lines when API is ready
  // ============================================
  //const apiUpcomingEvents = upcomingEvents;
  //const apiPastEvents = pastEvents;
  //const isLoading = false;
  //const error = null;
  // ============================================

  //const {
  //  selectedCategory: upcomingCategory,
  //  currentPage: upcomingPage,
  //  paginatedItems: paginatedUpcomingEvents,
  //  totalPages: upcomingTotalPages,
  //  handleCategoryChange: handleUpcomingCategoryChange,
  //  setPage: setUpcomingPage,
  //} = usePagination<Event>({
  //  items: apiUpcomingEvents,
  //  itemsPerPageMobile: 1,
  //  itemsPerPageDesktop: 3,
  //  filterBy: (event) => event.category,
  //});
  //const upcomingCategories = EVENT_TYPES;

  //const {
  //  displayedItems: displayedPastEvents,
  //  toggleViewAll: toggleViewAllPast,
  //} = useViewAll<Event>({ items: apiPastEvents, initialLimit: 6 });

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
              onClick={() => refetchUpcoming()}
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

        <main className="w-[96%] md:w-[92%] lg:w-[85%] mx-auto px-6 py-5">
          {/* Upcoming Events Section */}
          {apiUpcomingEvents && (
            <section className="mb-16">
              <div className="flex flex-row items-center justify-between gap-3 sm:gap-0 mb-3 sm:mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-contrast">
                  Upcoming Events
                </h2>
              </div>

              {/*<CategoryFilter
              categories={upcomingCategories}
              selectedCategory={upcomingCategory}
              onCategoryChange={handleUpcomingCategoryChange}
            />*/}

              <GenericGrid
                items={apiUpcomingEvents.items}
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
                currentPage={apiUpcomingEvents.pageIndex}
                totalPages={apiUpcomingEvents.totalPages}
                onPageChange={setCurrentPage}
              />
            </section>
          )}
          {/* Past Events Section */}
          {apiPastEvents && (
            <section>
              <div className="flex flex-row items-center justify-between gap-3 sm:gap-0 mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-contrast">
                  Past Events
                </h2>
              </div>

              <GenericGrid
                items={apiPastEvents.items}
                emptyMessage="No past events to display."
                renderCard={(event: Event) => <PastEventCard event={event} />}
                gridCols="grid-cols-1 md:grid-cols-2"
                getKey={(event: Event) => event.id}
              />
            </section>
          )}
        </main>
      </div>
    </WithLayout>
  );
};

export default EventsPage;
