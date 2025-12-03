import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Pagination } from "@/shared/components/pagination";
import { PastEventCard } from "@/features/events/components";
import AddEditEventModal from "../components/eventAdminPanel/AddEditEventModal";
import type { EventFormData } from "../types/eventFormTypes";
import { MdAdd } from "react-icons/md";
import type Event from "@/shared/types/events";
import { upcomingEvents } from "@/features/events/data/dummyEvents";
import { Button } from "tccd-ui";
import { WithLayout } from "@/shared/components/hoc";

export default function EventsAdminPage() {
  const eventsPerPage = 5; //We can adjust this as much as we want, really
  const withAdminPriviliges: boolean = true; //Replace that with actual user permissions from redux, until the login module is finalized leave as is
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState<number>(
    parseInt(searchParams.get("page") || "1", 10)
  );
  const [currentEvents, setCurrentEvents] = useState<Event[]>(() => {
    const initialPage = parseInt(searchParams.get("page") || "1", 10);
    const start = (initialPage - 1) * eventsPerPage;
    const end = Math.min(initialPage * eventsPerPage, upcomingEvents.length);
    return upcomingEvents.slice(start, end);
  });
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(
    undefined
  );
  function changePage(newPageNumber: number) {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("page", newPageNumber.toString());
    setSearchParams(newSearchParams);
    setCurrentPage(newPageNumber);
    setCurrentEvents(
      upcomingEvents.slice(
        (newPageNumber - 1) * eventsPerPage,
        Math.min(newPageNumber * eventsPerPage, upcomingEvents.length)
      )
    ); //To be replaced with an API call asking for next page
  }
  return (
    <WithLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-secondary">
            Event Management
          </h1>
          {withAdminPriviliges && (
            <Button
              buttonText="Add Event"
              buttonIcon={<MdAdd className="text-lg md:text-xl" />}
              type="ghost"
              onClick={() => {
                setSelectedEvent(undefined);
                setIsEventModalOpen(true);
              }}
            />
          )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {currentEvents.map((event) => (
            <PastEventCard
              key={event.id}
              event={event}
              canEdit={withAdminPriviliges}
              onEdit={() => {
                setSelectedEvent(event);
                setIsEventModalOpen(true);
              }}
            />
          ))}
        </div>
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(upcomingEvents.length / eventsPerPage)}
            onPageChange={changePage}
          />
        </div>
        {isEventModalOpen && (
          <AddEditEventModal
            event={selectedEvent}
            onClose={() => setIsEventModalOpen(false)}
            onSave={(eventFormData: EventFormData) => {
              console.log("Saved event form data:", eventFormData);
              setIsEventModalOpen(false);
            }}
          />
        )}
      </div>
    </WithLayout>
  );
}
