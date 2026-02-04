import { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Pagination } from "@/shared/components/pagination";
import { WithLayout } from "@/shared/components/hoc";
import EventsFilter from "@/features/events/components/EventsFilter";
import AdminEventCard from "@/features/admin/components/eventAdminPanel/AdminEventCard";
import AddEditEventModal from "../components/eventAdminPanel/AddEditEventModal";
import { Button } from "tccd-ui";
import { MdAdd } from "react-icons/md";
import toast from "react-hot-toast";
import type Event from "@/shared/types/events";
import { useGetAllUpcomingEvents, useGetAllPastEvents } from "@/shared/queries/events";
import type { EventQueryParams } from "@/shared/types/events";
import GenericGrid from "@/shared/components/GenericGrid";

const AdminEventsListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [upcomingQueryParams, setUpcomingQueryParams] = useState<EventQueryParams>({
    PageNumber: parseInt(searchParams.get("upcomingPage") || "1", 10),
    PageSize: 3,
  });

  const { data: upcomingData, isLoading: isLoadingUpcoming } = useGetAllUpcomingEvents(upcomingQueryParams);

  const [pastQueryParams, setPastQueryParams] = useState<EventQueryParams>({
    PageNumber: parseInt(searchParams.get("pastPage") || "1", 10),
    PageSize: 12,
  });

  const { data: pastData, isLoading: isLoadingPast } = useGetAllPastEvents(pastQueryParams);

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(undefined);

  const handleApplyUpcomingFilters = useCallback((stagingParams: EventQueryParams) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const start = stagingParams.StartDate
      ? new Date(stagingParams.StartDate)
      : null;

    if (start && start < now) {
      toast.error("Start date cannot be in the past for upcoming events");
      return;
    }

    setUpcomingQueryParams({
      ...stagingParams,
      PageNumber: 1,
    });

    const newParams = new URLSearchParams(searchParams);
    newParams.set("upcomingPage", "1");
    setSearchParams(newParams);
  }, [setUpcomingQueryParams, searchParams, setSearchParams]);

  const handleApplyPastFilters = useCallback((stagingParams: EventQueryParams) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const endDate = stagingParams.EndDate ? new Date(stagingParams.EndDate) : null;
    const startDate = stagingParams.StartDate ? new Date(stagingParams.StartDate) : null;

    if (endDate && endDate > now) {
      toast.error("End date cannot be in the future for past events");
      return;
    }

    if (startDate && endDate && startDate > endDate) {
      toast.error("Start date cannot be after end date");
      return;
    }

    setPastQueryParams({
      ...stagingParams,
      PageNumber: 1,
    });

    const newParams = new URLSearchParams(searchParams);
    newParams.set("pastPage", "1");
    setSearchParams(newParams);
  }, [setPastQueryParams, searchParams, setSearchParams]);

  const handleUpcomingPageChange = useCallback((newPage: number) => {
    setUpcomingQueryParams((prev) => ({
      ...prev,
      PageNumber: newPage,
    }));

    const newParams = new URLSearchParams(searchParams);
    newParams.set("upcomingPage", newPage.toString());
    setSearchParams(newParams);

    setTimeout(() => {
      document.getElementById("upcoming-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [setUpcomingQueryParams, searchParams, setSearchParams]);

  const handlePastPageChange = useCallback((newPage: number) => {
    setPastQueryParams((prev) => ({
      ...prev,
      PageNumber: newPage,
    }));

    const newParams = new URLSearchParams(searchParams);
    newParams.set("pastPage", newPage.toString());
    setSearchParams(newParams);

    setTimeout(() => {
      document.getElementById("past-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [setPastQueryParams, searchParams, setSearchParams]);

  const handleAddEvent = useCallback(() => {
    setSelectedEvent(undefined);
    setIsEventModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsEventModalOpen(false);
    setSelectedEvent(undefined);
  }, []);

  return (
    <WithLayout>
      <div className="py-8 px-4 md:px-8">
        <div className="flex flex-col sm:flex-row items-start pb-4 sm:items-center justify-between gap-2 md:gap-4">
          <div>
            <p className="text-[26px] md:text-[28px] lg:text-[30px] font-bold text-contrast">
              Event Management
            </p>
            <p className="text-inactive-tab-text text-[15px] md:text-[16px] lg:text-[18px]">
              Manage all upcoming and past events
            </p>
          </div>
          <Button
            buttonText="Add Event"
            buttonIcon={<MdAdd className="text-lg md:text-xl" />}
            type="primary"
            onClick={handleAddEvent}
          />
        </div>

        <section
          id="upcoming-section"
          className="rounded-xl mb-4 md:mb-6 border border-contrast/10 bg-background/60 p-4 sm:p-5 lg:p-6 shadow-sm"
        >
          <div className="flex flex-col gap-3">
            <div>
              <h2 className="text-[22px] md:text-[23px] lg:text-[24px] font-bold text-secondary">
                Upcoming Events
              </h2>
              <p className="text-[14px] md:text-[15px] lg:text-[16px] text-inactive-tab-text">
                Manage your upcoming events and modify details as needed.
              </p>
            </div>
            <EventsFilter
              searchParams={upcomingQueryParams}
              onSearch={handleApplyUpcomingFilters}
            />
            <hr className="border-t border-gray-400/60 -mt-2 mb-3 shadow-lg" />
          </div>

          {isLoadingUpcoming && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] w-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-contrast mx-auto mb-4"></div>
                <p className="text-lg text-secondary font-medium">
                  Loading upcoming events...
                </p>
              </div>
            </div>
          )}

          {!isLoadingUpcoming && upcomingData && (
            <>
              {upcomingData.items && upcomingData.items.length > 0 ? (
                <>
                  <GenericGrid
                    items={upcomingData.items}
                    emptyMessage="No upcoming events. Start by adding your first event to manage."
                    renderCard={(event: Event) => (
                      <AdminEventCard
                        event={event}
                        onEdit={() => {
                          setSelectedEvent(event);
                          setIsEventModalOpen(true);
                        }}
                      />
                    )}
                    gridCols="grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
                    getKey={(event: Event) => event.id}
                  />
                  <Pagination
                    currentPage={upcomingData.pageIndex}
                    totalPages={upcomingData.totalPages}
                    onPageChange={handleUpcomingPageChange}
                  />
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-secondary font-semibold text-lg">
                    No upcoming events. Click the Add Event button to create one.
                  </p>
                </div>
              )}
            </>
          )}
        </section>

        <section
          id="past-section"
          className="rounded-xl border border-contrast/10 bg-background/60 p-4 sm:p-5 lg:p-6 shadow-sm"
        >
          <div className="flex flex-col gap-3">
            <div>
              <h2 className="text-[22px] md:text-[23px] lg:text-[24px] font-bold text-secondary">
                Past Events
              </h2>
              <p className="text-[15px] md:text-[16px] lg:text-[18px] text-inactive-tab-text">
                View and manage your past events archive.
              </p>
            </div>
            <EventsFilter
              searchParams={pastQueryParams}
              onSearch={handleApplyPastFilters}
            />
            <hr className="border-t border-gray-400/60 -mt-2 mb-3 shadow-lg" />
          </div>

          {isLoadingPast && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] w-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-contrast mx-auto mb-4"></div>
                <p className="text-lg text-secondary font-medium">
                  Loading past events...
                </p>
              </div>
            </div>
          )}

          {!isLoadingPast && pastData && (
            <>
              {pastData.items && pastData.items.length > 0 ? (
                <>
                  <GenericGrid
                    items={pastData.items}
                    emptyMessage="No past events found."
                    gridCols="grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
                    getKey={(event: Event) => event.id}
                    renderCard={(event: Event) => (
                      <AdminEventCard
                        event={event}
                        onEdit={() => {
                          setSelectedEvent(event);
                          setIsEventModalOpen(true);
                        }}
                      />
                    )}
                  />
                  <Pagination
                    currentPage={pastData.pageIndex}
                    totalPages={pastData.totalPages}
                    onPageChange={handlePastPageChange}
                  />
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-secondary font-semibold text-lg">
                    No past events to display.
                  </p>
                </div>
              )}
            </>
          )}
        </section>

        {isEventModalOpen && (
          <AddEditEventModal
            event={selectedEvent}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </WithLayout>
  );
};

export default AdminEventsListPage;
