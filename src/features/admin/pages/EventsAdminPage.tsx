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
      <div className="w-full max-w-7xl mx-auto space-y-4 md:space-y-6 px-2 sm:px-4 md:px-6">
        <div className="bg-white rounded-2xl md:rounded-4xl shadow-lg md:shadow-xl p-4 sm:p-5 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 md:mb-5">
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
          <div className="mt-4 md:mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(upcomingEvents.length / eventsPerPage)}
              onPageChange={changePage}
            />
          </div>
        </div>
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
    </WithLayout>
  );
}
