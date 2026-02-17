import { PastEventCard, UpcomingEventCard } from "../components";
import { Pagination } from "@/shared/components/pagination";
import UpperHeader from "@/shared/components/mainpages/UpperHeader";
import WithLayout from "@/shared/components/hoc/WithLayout";
import GenericGrid from "@/shared/components/GenericGrid";
import type Event from "@/shared/types/events";
import { useEvents } from "../hooks";
import { useState } from "react";
import type { EventQueryParams } from "@/shared/types/events";
import toast from "react-hot-toast";
import EventsFilter from "../components/EventsFilter";
import { Button, ErrorScreen } from "tccd-ui";
import { useNavigate } from "react-router-dom";
import EVENT_HEADER_IMAGE from "@/assets/eventsHeader.jpeg";
import { useEffect } from "react";

const getResponsivePageSize = () => {
  const width = window.innerWidth;
  if (width < 768) return 1;
  if (width < 1024) return 2;
  return 3;
};

const EventsPage = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(getResponsivePageSize());
  const [queryParams, setQueryParams] = useState<EventQueryParams>({
    PageNumber: 1,
    PageSize: getResponsivePageSize(),
  });
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const newSize = getResponsivePageSize();
      setPageSize(newSize);
      setQueryParams((prev) => ({ ...prev, PageSize: newSize, PageNumber: 1 }));
      setPageNumber(1);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setQueryParams((prev) => ({ ...prev, PageNumber: pageNumber, PageSize: pageSize }));
  }, [pageNumber, pageSize]);

  const handleApplyFilters = (stagingParams: EventQueryParams) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const start = stagingParams.StartDate
      ? new Date(stagingParams.StartDate)
      : null;

    if (start && start < now) {
      toast.error(
        "Start date cannot be in the past, Please head to the Past Events section",
      );
      return;
    }

    setQueryParams(stagingParams);
  };

  const {
    upcomingEvents: apiUpcomingEvents,
    pastEvents: apiPastEvents,
    isLoadingUpcoming,
    isLoadingPast,
    upcomingError,
    pastError,
    refetchUpcoming,
    refetchPast,
  } = useEvents(queryParams, true);

  useEvents({ ...queryParams, PageNumber: pageNumber + 1, PageSize: pageSize }, true);

  const onBookNow = (id: string) => {
    navigate(`/events/register/${id}`);
  };
  const onLearnMore = (id: string) => {
    navigate(`/events/${id}`);
  };

  if (upcomingError && pastError) {
    return (
      <WithLayout>
        <ErrorScreen title="Failed to load Events" message={upcomingError.message} />
      </WithLayout>
    );
  }

  return (
    <WithLayout>
      <div className="min-h-screen bg-gray-50">
        <UpperHeader
          image={EVENT_HEADER_IMAGE}
          title="Events"
          subtitle="Explore the catalogue of our latest and history of events on full display"
        />

        <main className="w-[97%] md:w-[95%] lg:w-[92%] xl:w-[84%] mx-auto px-0 md:px-6 py-2 md:pt-5 md:py-5">
          <section className="mb-6 md:mb-10 shadow-lg p-2 md:p-3 relative pb-5 md:pb-7 bg-background rounded-t-2xl">
            <div className="flex flex-col md:gap-1 gap-0 mb-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-secondary">
                Upcoming Events
              </h2>
              <p className="text-sm md:text-base text-inactive-tab-text">
                Stay updated with our upcoming events and workshops.
              </p>
            </div>
            <div className="mb-3">
              <EventsFilter
                searchParams={queryParams}
                onSearch={(params) => handleApplyFilters(params)}
              />
            </div>
            <hr className="mb-4 -mt-2 border-t border-gray-400/80" />
            {isLoadingUpcoming && (
              <div className="flex flex-col items-center justify-center min-h-[50vh] w-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-contrast mx-auto mb-4"></div>
                  <p className="text-lg text-secondary font-medium">
                    Loading events...
                  </p>
                </div>
              </div>
            )}
            {upcomingError && (
              <div className="flex flex-col items-center justify-center min-h-[50vh] w-full">
                <div className="text-center">
                  <p className="text-lg text-red-600 mb-4">
                    Failed to load events
                  </p>
                  <button
                    onClick={() => refetchUpcoming()}
                    className="px-4 py-2 bg-contrast text-white rounded-lg hover:bg-contrast/90"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}
            {apiUpcomingEvents && (
              <>
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
                  gridCols="grid-cols-1 md:grid-cols-2 2xl:grid-cols-3"
                  getKey={(event: Event) => event.id}
                />
                <Pagination
                  currentPage={apiUpcomingEvents.pageIndex}
                  totalPages={apiUpcomingEvents.totalPages}
                  onPageChange={(page: number) => {
                    setPageNumber(page);
                  }}
                />
              </>
            )}
            <div className="h-1 bg-linear-to-r from-secondary via-primary to-secondary rounded-full absolute left-0 right-0 w-full bottom-0"></div>
          </section>
          {/* Past Events Section */}
          <section className="mb-4 md:mb-10 shadow-lg p-2 md:p-3 relative pb-5 md:pb-7 bg-background rounded-t-2xl">
            <div className="flex flex-col md:gap-1 gap-0 mb-2 sm:mb-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-secondary">
                Past Events
              </h2>
              <p className="text-sm md:text-base text-inactive-tab-text">
                A small collection of our memorable past milestones and
                achievements.
              </p>
            </div>
            {isLoadingPast && (
              <div className="flex flex-col items-center justify-center min-h-[50vh] w-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-contrast mx-auto mb-4"></div>
                  <p className="text-lg text-secondary font-medium">
                    Loading events...
                  </p>
                </div>
              </div>
            )}
            {pastError && (
              <div className="flex flex-col items-center justify-center min-h-[50vh] w-full">
                <div className="text-center">
                  <p className="text-lg text-red-600 mb-4">
                    Failed to load events
                  </p>
                  <button
                    onClick={() => refetchPast()}
                    className="px-4 py-2 bg-contrast text-white rounded-lg hover:bg-contrast/90"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}
            {apiPastEvents && (
              <>
                <GenericGrid
                  items={apiPastEvents.items}
                  emptyMessage="No past events to display."
                  renderCard={(event: Event) => <PastEventCard event={event} />}
                  gridCols="grid-cols-1 md:grid-cols-2 2xl:grid-cols-3"
                  getKey={(event: Event) => event.id}
                />
                {apiPastEvents.totalPages > 1 && (
                  <div className="flex justify-center w-fit mx-auto pt-4">
                    <Button type="secondary" onClick={() => navigate("/past-events")} buttonText="View all" />
                  </div>
                )}
              </>
            )}
            <div className="h-1 bg-linear-to-r from-secondary via-primary to-secondary rounded-full absolute left-0 right-0 w-full bottom-0"></div>
          </section>
        </main>
      </div>
    </WithLayout>
  );
};

export default EventsPage;
