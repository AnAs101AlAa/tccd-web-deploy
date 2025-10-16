import CategoryFilter from "../components/CategoryFilter";
import EventsGrid from "../components/EventsGrid";
import Pagination from "@/shared/components/Pagination";
import UpperHeader from "@/shared/components/mainpages/UpperHeader";
import { upcomingEvents, pastEvents } from "../data/dummyEvents";
import WithNavbar from "@/shared/components/hoc/WithNavbar";
import { usePagination, useViewAll } from "@/shared/hooks";
import ViewAllButton from "@/shared/components/ViewAllButton";
import type Event from "@/shared/types/events";

const EventsPage = () => {
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
    items: upcomingEvents,
    filterBy: (event) => event.category,
  });

  // Past events view all logic
  const {
    displayedItems: displayedPastEvents,
    isViewingAll: isViewingAllPast,
    hasMore: hasMorePast,
    toggleViewAll: toggleViewAllPast,
  } = useViewAll<Event>({ items: pastEvents, initialLimit: 6 });

  return (
    <WithNavbar>
      <div className="min-h-screen bg-gray-50">
        <UpperHeader
          image=""
          title="Events"
          subtitle="Explore the catalogue of our latest and history of events on full display"
        />

        <main className="max-w-7xl mx-auto px-6 py-12">
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
            />

            <ViewAllButton
              isViewingAll={isViewingAllPast}
              hasMore={hasMorePast}
              onClick={toggleViewAllPast}
            />
          </section>
        </main>
      </div>
    </WithNavbar>
  );
};

export default EventsPage;
