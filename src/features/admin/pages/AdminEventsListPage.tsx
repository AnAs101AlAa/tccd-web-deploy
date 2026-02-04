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
import { useIsAdmin } from "@/shared/queries/user/userHooks";
import type Event from "@/shared/types/events";
import type { EventQueryParams } from "@/shared/types/events";
import type { EventFormData } from "../types/eventFormTypes";

const AdminEventsListPage = () => {
  const isAdmin = useIsAdmin();
  const [searchParams, setSearchParams] = useSearchParams();

  const [upcomingQueryParams, setUpcomingQueryParams] = useState<EventQueryParams>({
    PageNumber: parseInt(searchParams.get("upcomingPage") || "1", 10),
    PageSize: 10,
  });

  const [pastQueryParams, setPastQueryParams] = useState<EventQueryParams>({
    PageNumber: parseInt(searchParams.get("pastPage") || "1", 10),
    PageSize: 10,
  });

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(undefined);

  const [mockEvents, setMockEvents] = useState<Event[]>([
    {
      id: "1",
      name: "Annual Tech Conference 2026",
      description: "Join us for an exciting discussion on latest technologies and innovations in the industry.",
      eventImage: "https://via.placeholder.com/600x400?text=Tech+Conference",
      type: "Workshop",
      date: new Date(2026, 1, 15).toISOString(),
      location: "Cairo Convention Center",
      isApproved: true,
      capacity: 500,
      attendeeCount: 342,
      registrationDeadline: new Date(2026, 1, 10).toISOString(),
      createdBy: "admin",
      createdAt: new Date().toISOString(),
      updatedOn: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Web Development Bootcamp",
      description: "Intensive 2-week program covering modern web development practices.",
      eventImage: "https://via.placeholder.com/600x400?text=Web+Dev",
      type: "Sessions",
      date: new Date(2026, 1, 28).toISOString(),
      location: "Tech Hub Cairo",
      isApproved: true,
      capacity: 100,
      attendeeCount: 87,
      registrationDeadline: new Date(2026, 1, 22).toISOString(),
      createdBy: "admin",
      createdAt: new Date().toISOString(),
      updatedOn: new Date().toISOString(),
    },
    {
      id: "3",
      name: "AI & Machine Learning Summit",
      description: "Explore the future of AI and its applications in various industries.",
      eventImage: "https://via.placeholder.com/600x400?text=AI+Summit",
      type: "Researchday",
      date: new Date(2026, 2, 10).toISOString(),
      location: "Nile University",
      isApproved: true,
      capacity: 800,
      attendeeCount: 650,
      registrationDeadline: new Date(2026, 2, 5).toISOString(),
      createdBy: "admin",
      createdAt: new Date().toISOString(),
      updatedOn: new Date().toISOString(),
    },
    {
      id: "4",
      name: "Campus Orientation Day",
      description: "Welcome session for new students with campus tours and Q&A.",
      eventImage: "https://via.placeholder.com/600x400?text=Orientation",
      type: "Orientation",
      date: new Date(2026, 2, 20).toISOString(),
      location: "Main Auditorium",
      isApproved: true,
      capacity: 300,
      attendeeCount: 210,
      registrationDeadline: new Date(2026, 2, 15).toISOString(),
      createdBy: "admin",
      createdAt: new Date().toISOString(),
      updatedOn: new Date().toISOString(),
    },
    {
      id: "5",
      name: "Industry Job Fair 2026",
      description: "Meet top employers and explore internship and job opportunities.",
      eventImage: "https://via.placeholder.com/600x400?text=Job+Fair",
      type: "Jobfair",
      date: new Date(2026, 3, 5).toISOString(),
      location: "Exhibition Hall",
      isApproved: true,
      capacity: 1200,
      attendeeCount: 980,
      registrationDeadline: new Date(2026, 2, 28).toISOString(),
      createdBy: "admin",
      createdAt: new Date().toISOString(),
      updatedOn: new Date().toISOString(),
    },
    {
      id: "6",
      name: "Cybersecurity Field Trip",
      description: "Visit a leading security operations center and learn best practices.",
      eventImage: "https://via.placeholder.com/600x400?text=Field+Trip",
      type: "Fieldtrip",
      date: new Date(2026, 3, 12).toISOString(),
      location: "Smart Village",
      isApproved: true,
      capacity: 80,
      attendeeCount: 62,
      registrationDeadline: new Date(2026, 3, 6).toISOString(),
      createdBy: "admin",
      createdAt: new Date().toISOString(),
      updatedOn: new Date().toISOString(),
    },
    {
      id: "7",
      name: "Research Poster Sessions",
      description: "Students present posters and get feedback from faculty.",
      eventImage: "https://via.placeholder.com/600x400?text=Poster+Sessions",
      type: "Sessions",
      date: new Date(2026, 3, 18).toISOString(),
      location: "Science Building",
      isApproved: true,
      capacity: 250,
      attendeeCount: 180,
      registrationDeadline: new Date(2026, 3, 12).toISOString(),
      createdBy: "admin",
      createdAt: new Date().toISOString(),
      updatedOn: new Date().toISOString(),
    },
    {
      id: "8",
      name: "Startup Recruitment Day",
      description: "Hiring booths from early-stage startups and tech teams.",
      eventImage: "https://via.placeholder.com/600x400?text=Recruitment",
      type: "Recruitment",
      date: new Date(2026, 3, 22).toISOString(),
      location: "Innovation Hub",
      isApproved: true,
      capacity: 600,
      attendeeCount: 430,
      registrationDeadline: new Date(2026, 3, 16).toISOString(),
      createdBy: "admin",
      createdAt: new Date().toISOString(),
      updatedOn: new Date().toISOString(),
    },
  ]);

  const [mockPastEvents, setMockPastEvents] = useState<Event[]>([
    {
      id: "past-1",
      name: "2025 Annual Summit",
      description: "Recap of the most important events from 2025.",
      eventImage: "https://via.placeholder.com/600x400?text=2025+Summit",
      type: "Sessions",
      date: new Date(2025, 11, 20).toISOString(),
      location: "Grand Hotel Cairo",
      isApproved: true,
      capacity: 1000,
      attendeeCount: 892,
      registrationDeadline: new Date(2025, 11, 15).toISOString(),
      createdBy: "admin",
      createdAt: new Date(2025, 10, 1).toISOString(),
      updatedOn: new Date(2025, 11, 20).toISOString(),
    },
    {
      id: "past-2",
      name: "Tech Innovation Showcase 2025",
      description: "Showcasing cutting-edge technology innovations.",
      eventImage: "https://via.placeholder.com/600x400?text=Tech+Showcase",
      type: "Researchday",
      date: new Date(2025, 10, 15).toISOString(),
      location: "Innovation Hub",
      isApproved: true,
      capacity: 350,
      attendeeCount: 298,
      registrationDeadline: new Date(2025, 10, 10).toISOString(),
      createdBy: "admin",
      createdAt: new Date(2025, 9, 1).toISOString(),
      updatedOn: new Date(2025, 10, 15).toISOString(),
    },
    {
      id: "past-3",
      name: "Autumn Job Fair 2025",
      description: "Career fair with 40+ companies and on-site interviews.",
      eventImage: "https://via.placeholder.com/600x400?text=Job+Fair+2025",
      type: "Jobfair",
      date: new Date(2025, 9, 22).toISOString(),
      location: "Exhibition Hall",
      isApproved: true,
      capacity: 900,
      attendeeCount: 740,
      registrationDeadline: new Date(2025, 9, 18).toISOString(),
      createdBy: "admin",
      createdAt: new Date(2025, 8, 20).toISOString(),
      updatedOn: new Date(2025, 9, 22).toISOString(),
    },
    {
      id: "past-4",
      name: "Field Trip: Data Center Tour",
      description: "Guided tour of a national data center.",
      eventImage: "https://via.placeholder.com/600x400?text=Data+Center+Tour",
      type: "Fieldtrip",
      date: new Date(2025, 8, 30).toISOString(),
      location: "6th of October City",
      isApproved: true,
      capacity: 60,
      attendeeCount: 54,
      registrationDeadline: new Date(2025, 8, 20).toISOString(),
      createdBy: "admin",
      createdAt: new Date(2025, 8, 1).toISOString(),
      updatedOn: new Date(2025, 8, 30).toISOString(),
    },
    {
      id: "past-5",
      name: "Recruitment Drive: FinTech",
      description: "FinTech companies hosted assessments and interviews.",
      eventImage: "https://via.placeholder.com/600x400?text=FinTech+Recruitment",
      type: "Recruitment",
      date: new Date(2025, 7, 18).toISOString(),
      location: "Business School",
      isApproved: true,
      capacity: 500,
      attendeeCount: 420,
      registrationDeadline: new Date(2025, 7, 10).toISOString(),
      createdBy: "admin",
      createdAt: new Date(2025, 6, 25).toISOString(),
      updatedOn: new Date(2025, 7, 18).toISOString(),
    },
    {
      id: "past-6",
      name: "Orientation Week 2025",
      description: "A week of welcome activities and academic guidance.",
      eventImage: "https://via.placeholder.com/600x400?text=Orientation+2025",
      type: "Orientation",
      date: new Date(2025, 8, 10).toISOString(),
      location: "Main Auditorium",
      isApproved: true,
      capacity: 400,
      attendeeCount: 360,
      registrationDeadline: new Date(2025, 8, 5).toISOString(),
      createdBy: "admin",
      createdAt: new Date(2025, 7, 20).toISOString(),
      updatedOn: new Date(2025, 8, 10).toISOString(),
    },
    {
      id: "past-7",
      name: "Research Day 2025",
      description: "Faculty and students presented research outcomes.",
      eventImage: "https://via.placeholder.com/600x400?text=Research+Day",
      type: "Researchday",
      date: new Date(2025, 6, 12).toISOString(),
      location: "Engineering Building",
      isApproved: true,
      capacity: 700,
      attendeeCount: 615,
      registrationDeadline: new Date(2025, 6, 5).toISOString(),
      createdBy: "admin",
      createdAt: new Date(2025, 5, 20).toISOString(),
      updatedOn: new Date(2025, 6, 12).toISOString(),
    },
    {
      id: "past-8",
      name: "Frontend Workshop 2025",
      description: "Hands-on workshop on modern frontend tooling.",
      eventImage: "https://via.placeholder.com/600x400?text=Frontend+Workshop",
      type: "Workshop",
      date: new Date(2025, 5, 5).toISOString(),
      location: "Tech Hub Cairo",
      isApproved: true,
      capacity: 120,
      attendeeCount: 112,
      registrationDeadline: new Date(2025, 4, 28).toISOString(),
      createdBy: "admin",
      createdAt: new Date(2025, 4, 1).toISOString(),
      updatedOn: new Date(2025, 5, 5).toISOString(),
    },
  ]);

  const useMockData = true;
  const isLoadingUpcoming = false;
  const isLoadingPast = false;

  const pageSize = 6;
  const normalize = (value?: string) => value?.trim().toLowerCase();
  const filterEvents = (events: Event[], params: EventQueryParams) => {
    let result = events;

    if (params.Name) {
      const nameQuery = normalize(params.Name);
      if (nameQuery) {
        result = result.filter((event) => event.name.toLowerCase().includes(nameQuery));
      }
    }

    if (params.Type) {
      result = result.filter((event) => event.type === params.Type);
    }

    if (params.Location) {
      const locationQuery = normalize(params.Location);
      if (locationQuery) {
        result = result.filter((event) => event.location.toLowerCase().includes(locationQuery));
      }
    }

    if (params.StartDate) {
      const start = new Date(params.StartDate);
      result = result.filter((event) => new Date(event.date) >= start);
    }

    if (params.EndDate) {
      const end = new Date(params.EndDate);
      result = result.filter((event) => new Date(event.date) <= end);
    }

    return result;
  };

  const filteredUpcomingEvents = filterEvents(mockEvents, upcomingQueryParams);
  const filteredPastEvents = filterEvents(mockPastEvents, pastQueryParams);

  const upcomingTotalPages = Math.ceil(filteredUpcomingEvents.length / pageSize);
  const upcomingStartIndex = ((upcomingQueryParams.PageNumber || 1) - 1) * pageSize;
  const upcomingEndIndex = upcomingStartIndex + pageSize;
  const paginatedUpcomingEvents = filteredUpcomingEvents.slice(upcomingStartIndex, upcomingEndIndex);

  const pastTotalPages = Math.ceil(filteredPastEvents.length / pageSize);
  const pastStartIndex = ((pastQueryParams.PageNumber || 1) - 1) * pageSize;
  const pastEndIndex = pastStartIndex + pageSize;
  const paginatedPastEvents = filteredPastEvents.slice(pastStartIndex, pastEndIndex);

  const upcomingMockData = {
    items: paginatedUpcomingEvents,
    pageIndex: upcomingQueryParams.PageNumber || 1,
    totalPages: upcomingTotalPages,
    totalCount: filteredUpcomingEvents.length,
    pageSize: pageSize,
    hasPreviousPage: (upcomingQueryParams.PageNumber || 1) > 1,
    hasNextPage: (upcomingQueryParams.PageNumber || 1) < upcomingTotalPages,
  };

  const pastMockData = {
    events: paginatedPastEvents,
    pageIndex: pastQueryParams.PageNumber || 1,
    totalPages: pastTotalPages,
    totalCount: filteredPastEvents.length,
    pageSize: pageSize,
  };

  const upcomingData = useMockData ? upcomingMockData : undefined;
  const pastData = useMockData ? pastMockData : undefined;

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

  const handleDeleteEvent = useCallback(async (_eventId: string) => {
    const loadingToastId = toast.loading("Deleting event...");
    
    try {
      await new Promise<void>((resolve) => setTimeout(resolve, 500));
      
      setMockEvents(prev => prev.filter(e => e.id !== _eventId));
      setMockPastEvents(prev => prev.filter(e => e.id !== _eventId));
      
      toast.dismiss(loadingToastId);
      toast.success("Event deleted successfully");
    } catch (error) {
      toast.dismiss(loadingToastId);
      const errorMsg = error instanceof Error ? error.message : "Failed to delete event";
      toast.error(errorMsg);
      console.error("Delete error:", error);
    }
  }, []);

  const handleAddEvent = useCallback(() => {
    setSelectedEvent(undefined);
    setIsEventModalOpen(true);
  }, []);

  const handleSaveEvent = useCallback(async (eventFormData: EventFormData) => {
    const loadingToastId = toast.loading(
      selectedEvent ? "Updating event..." : "Creating event..."
    );
    
    try {
      await new Promise<void>((resolve) => setTimeout(resolve, 500));
      
      if (selectedEvent) {
        const updatedEvent: Event = {
          ...selectedEvent,
          name: eventFormData.title,
          description: eventFormData.description,
          type: eventFormData.eventType as any,
          date: eventFormData.date,
          location: eventFormData.location,
          eventImage: typeof eventFormData.eventPoster === "string" ? eventFormData.eventPoster : selectedEvent.eventImage,
          registrationDeadline: eventFormData.date,
          capacity: eventFormData.capacity,
          attendeeCount: eventFormData.attendeeCount,
          updatedOn: new Date().toISOString(),
        };
        
        setMockEvents(prev => prev.map(e => e.id === selectedEvent.id ? updatedEvent : e));
        setMockPastEvents(prev => prev.map(e => e.id === selectedEvent.id ? updatedEvent : e));
      } else {
        const newEvent: Event = {
          id: `event-${Date.now()}`,
          name: eventFormData.title,
          description: eventFormData.description,
          type: eventFormData.eventType as any,
          date: eventFormData.date,
          location: eventFormData.location,
          eventImage: typeof eventFormData.eventPoster === "string" ? eventFormData.eventPoster : "https://via.placeholder.com/600x400?text=New+Event",
          registrationDeadline: eventFormData.date,
          capacity: eventFormData.capacity,
          attendeeCount: eventFormData.attendeeCount || 0,
          isApproved: false,
          createdBy: "admin",
          createdAt: new Date().toISOString(),
          updatedOn: new Date().toISOString(),
        };
        
        setMockEvents(prev => [newEvent, ...prev]);
      }
      
      toast.dismiss(loadingToastId);
      toast.success(
        selectedEvent ? "Event updated successfully" : "Event created successfully"
      );
      
      setIsEventModalOpen(false);
      setSelectedEvent(undefined);
    } catch (error) {
      toast.dismiss(loadingToastId);
      const errorMsg = error instanceof Error ? error.message : "Failed to save event";
      toast.error(errorMsg);
      console.error("Save error:", error);
    }
  }, [selectedEvent]);

  const handleCloseModal = useCallback(() => {
    setIsEventModalOpen(false);
    setSelectedEvent(undefined);
  }, []);

  return (
    <WithLayout>
      <div className="w-full h-full flex flex-col max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-2 lg:py-4 gap-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-secondary">
              Event Management
            </h1>
            <p className="text-inactive-tab-text text-sm md:text-base mt-1">
              Manage all upcoming and past events
            </p>
          </div>
          {isAdmin && (
            <Button
              buttonText="Add Event"
              buttonIcon={<MdAdd className="text-lg md:text-xl" />}
              type="ghost"
              onClick={handleAddEvent}
            />
          )}
        </div>

        <section
          id="upcoming-section"
          className="rounded-xl border border-contrast/10 bg-background/60 p-4 sm:p-5 lg:p-6 shadow-sm"
        >
          <div className="flex flex-col gap-3">
            <div className="flex flex-col md:gap-1 gap-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-secondary">
                Upcoming Events
              </h2>
              <p className="text-sm md:text-base text-inactive-tab-text">
                Manage your upcoming events and modify details as needed.
              </p>
            </div>
            <EventsFilter
              searchParams={upcomingQueryParams}
              onSearch={handleApplyUpcomingFilters}
            />
            <hr className="border-t border-gray-400/60" />
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
                  <div className="flex flex-row gap-3 sm:gap-4 lg:gap-5 mt-4 overflow-x-auto pb-2">
                    {upcomingData.items.map((event: Event) => (
                      <div key={event.id} className="flex flex-col gap-3 h-full min-w-[280px] sm:min-w-[320px] lg:min-w-[360px]">
                        <AdminEventCard
                          event={event}
                          onEdit={() => {
                            setSelectedEvent(event);
                            setIsEventModalOpen(true);
                          }}
                          onDelete={() => handleDeleteEvent(event.id)}
                        />
                      </div>
                    ))}
                  </div>

                  {upcomingData.totalPages > 1 && (
                    <div className="mt-6">
                      <Pagination
                        currentPage={upcomingData.pageIndex}
                        totalPages={upcomingData.totalPages}
                        onPageChange={handleUpcomingPageChange}
                      />
                    </div>
                  )}
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
            <div className="flex flex-col md:gap-1 gap-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-secondary">
                Past Events
              </h2>
              <p className="text-sm md:text-base text-inactive-tab-text">
                View and manage your past events archive.
              </p>
            </div>
            <EventsFilter
              searchParams={pastQueryParams}
              onSearch={handleApplyPastFilters}
            />
            <hr className="border-t border-gray-400/60" />
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
              {pastData.events && pastData.events.length > 0 ? (
                <>
                  <div className="flex flex-row gap-3 sm:gap-4 lg:gap-5 mt-4 overflow-x-auto pb-2">
                    {pastData.events.map((event: Event) => (
                      <div key={event.id} className="flex flex-col gap-3 h-full min-w-[280px] sm:min-w-[320px] lg:min-w-[360px]">
                        <AdminEventCard
                          event={event}
                          onEdit={() => {
                            setSelectedEvent(event);
                            setIsEventModalOpen(true);
                          }}
                          onDelete={() => handleDeleteEvent(event.id)}
                        />
                      </div>
                    ))}
                  </div>

                  {pastData.totalPages > 1 && (
                    <div className="mt-6">
                      <Pagination
                        currentPage={pastData.pageIndex}
                        totalPages={pastData.totalPages}
                        onPageChange={handlePastPageChange}
                      />
                    </div>
                  )}
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
            onSave={handleSaveEvent}
          />
        )}
      </div>
    </WithLayout>
  );
};

export default AdminEventsListPage;
