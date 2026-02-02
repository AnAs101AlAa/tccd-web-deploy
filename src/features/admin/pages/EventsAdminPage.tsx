import { useState } from "react";
import { Pagination } from "@/shared/components/pagination";
import AddEditEventModal from "../components/eventAdminPanel/AddEditEventModal";
import { MdAdd } from "react-icons/md";
import type Event from "@/shared/types/events";
import { upcomingEvents } from "@/features/events/data/dummyEvents";
import { Button } from "tccd-ui";
import { WithLayout } from "@/shared/components/hoc";
import AdminEventCard from "../components/eventAdminPanel/AdminEventCard";
import { useFetchEvents } from "@/shared/queries/admin/events/eventsQueries";

export default function EventsAdminPage() {
  const eventsPerPage = 12;
  const withAdminPriviliges: boolean = true;
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data: currentEvents = [] } = useFetchEvents(currentPage, eventsPerPage);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(
    undefined
  );
  
  return (
    <WithLayout>
      <div className="w-full mx-auto space-y-4 md:space-y-6">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {currentEvents.map((event) => (
              <AdminEventCard
                key={event.id}
                event={event}
                onEdit={() => {
                  setSelectedEvent(event);
                  setIsEventModalOpen(true);
                }}
                onDelete={() => {
                  // Implement delete functionality here
                }}
              />
            ))}
          </div>
          <div className="mt-4 md:mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(upcomingEvents.length / eventsPerPage)}
              onPageChange={(page) => {
                setCurrentPage(page);
              }}
            />
          </div>
        </div>
      </div>
      {isEventModalOpen && (
        <AddEditEventModal
          event={selectedEvent}
          onClose={() => setIsEventModalOpen(false)}
        />
      )}
    </WithLayout>
  );
}
