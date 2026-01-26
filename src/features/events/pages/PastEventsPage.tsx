import { Pagination } from "@/shared/components/pagination";
import UpperHeader from "@/shared/components/mainpages/UpperHeader";
import WithNavbar from "@/shared/components/hoc/WithNavbar";
import GenericGrid from "@/shared/components/GenericGrid";
import PastEventCard from "../components/PastEventCard";
import EventsFilter from "../components/EventsFilter";
import type Event from "@/shared/types/events";
import type { EventQueryParams } from "@/shared/types/events";
import { LoadingPage, ErrorScreen } from "tccd-ui";
import { useGetAllPastEvents } from "@/shared/queries/events";
import { useState, useEffect } from "react";

const PastEventsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const currentDate = new Date();
  const todayFormatted = currentDate.toISOString().split('T')[0];
  const [searchParams, setSearchParams] = useState<EventQueryParams>({
    EndDate: currentDate.toISOString(),
    OrderBy: "Date",
    Descending: true,
  });

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const pageSize = isMobile ? 6 : 12;

  // Convert EventQueryParams to the format expected by getAllPastEvents
  const filters = {
    searchQuery: searchParams.Name,
    eventTypes: searchParams.Type ? [searchParams.Type] : undefined,
    startDate: searchParams.StartDate,
    endDate: searchParams.EndDate,
  };

  const { data, isLoading, error } = useGetAllPastEvents(currentPage, pageSize, filters);

  const apiPastEvents = data?.events || [];
  const totalPages = data?.totalPages || 0;

  useEffect(() => {
    if (!isLoading && (data)) {
      setIsInitialLoad(false);
    }
  }, [isLoading]);

  const handleSearch = (params: EventQueryParams) => {
    // Ensure EndDate is set for past events if not provided
    const updatedParams = {
      ...params,
      EndDate: params.EndDate || currentDate.toISOString(),
      OrderBy: params.OrderBy || "Date",
      Descending: params.Descending !== undefined ? params.Descending : true,
    };
    setSearchParams(updatedParams);
    setCurrentPage(1); // Reset to page 1 when applying filters
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isInitialLoad && isLoading) {
    return <LoadingPage />;
  }

  if (isInitialLoad && error) {
    return (
      <ErrorScreen
        message="An error occurred while fetching past events. Please try again and contact our team if the problem persists."
        title="Failed to load past events"
      />
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

        <main className="w-full xl:w-[80%] xl:mx-auto px-6 py-5">
          <section className="mb-16">
            <div className="mb-6">
              <EventsFilter
                searchParams={searchParams}
                onSearch={handleSearch}
                maxDate={todayFormatted}
              />
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-red-600 text-lg">
                  An error occurred Please try again later.
                </p>
              </div>
            ) : (
              <>
                <GenericGrid
                  items={apiPastEvents}
                  emptyMessage="No past events found. Try adjusting your filters."
                  renderCard={(event: Event) => <PastEventCard event={event} />}
                  gridCols="grid-cols-1 md:grid-cols-2"
                  getKey={(event: Event) => event.id}
                />

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </section>
        </main>
      </div>
    </WithNavbar>
  );
};

export default PastEventsPage;
