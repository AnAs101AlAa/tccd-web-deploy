import { useMemo, useState } from "react";
import { WithLayout } from "@/shared/components/hoc";
import { Pagination } from "@/shared/components/pagination";
import { useGetEventRegistrations, useFetchEvents } from "@/shared/queries/admin/events/eventsQueries";
import RegistrationsList from "../components/registrations/RegistrationsList";
import RegistrationsFilter from "../components/registrations/RegistrationsFilter";
import type Event from "@/shared/types/events";
import format from "@/shared/utils/dateFormater";
import { DropdownMenu } from "tccd-ui";

export default function RegistrationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(20);

  // Fetch events by search query using nameKey parameter
  const { data: eventsData } = useFetchEvents(1, 100, searchQuery || undefined);

  const filteredEvents = eventsData || [];

  // Fetch registrations for selected event
  const { data: registrationsData, isLoading: isLoadingRegistrations } =
    useGetEventRegistrations(
      selectedEvent?.id || "",
      pageNumber,
      pageSize,
      selectedSlotId || undefined
    );

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    setSelectedSlotId("");
    setPageNumber(1);
  };

  const handleSlotChange = (slotId: string) => {
    setSelectedSlotId(slotId);
    setPageNumber(1);
  };
  
  const displayedSlotOptions = useMemo(() => {
    if (!selectedEvent?.slots) return [];
    return [
      { label: "All Time Slots", value: "" },
      ...selectedEvent.slots.map((slot) => ({
        label: `${format(slot.startTime, "hourFull")} – ${format(slot.endTime, "hourFull")}`,
        value: slot.id,
      })),
    ];
  }, [selectedEvent]);

  return (
    <WithLayout>
      <div className="py-2 sm:py-4 md:py-8 px-3 sm:px-4 md:px-8">
        <div className="mb-3 sm:mb-4">
          <h1 className="text-xl sm:text-[24px] md:text-[32px] lg:text-[34px] font-bold text-contrast">
            Event Registrations
          </h1>
          <p className="text-inactive-tab-text text-sm sm:text-[15px] md:text-[16px] lg:text-[18px]">
            View and manage registrations for events.
          </p>
        </div>

        {/* Event Search Section */}
        <section className="rounded-lg sm:rounded-xl mb-3 sm:mb-4 md:mb-6 border border-contrast/10 bg-background/60 p-3 sm:p-4 md:p-5 lg:p-6 shadow-sm">
          <div className="flex flex-col gap-2 sm:gap-3">
            <div>
              <h2 className="text-base sm:text-lg md:text-[23px] lg:text-[24px] font-bold text-secondary">
                Select Event
              </h2>
              <p className="text-xs sm:text-sm md:text-[15px] lg:text-[16px] text-inactive-tab-text">
                Search and select an event to view its registrations.
              </p>
            </div>

            <RegistrationsFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            {/* Events List */}
            {searchQuery && (
              <div className="mt-2 sm:mt-3 md:mt-4">
                {filteredEvents.length > 0 ? (
                  <div className="grid gap-1 sm:gap-2 max-h-52 sm:max-h-64 overflow-y-auto">
                    {filteredEvents.map((event) => (
                      <button
                        key={event.id}
                        onClick={() => handleEventSelect(event)}
                        className={`p-2 sm:p-3 flex flex-col sm:flex-row gap-1 sm:gap-3 items-start sm:items-center rounded-md sm:rounded-lg text-left transition-colors text-xs sm:text-sm ${
                          selectedEvent?.id === event.id
                            ? "bg-primary text-white"
                            : "bg-slate-50 hover:bg-slate-100"
                        }`}
                      >
                        <p className="font-semibold">{event.name}</p>
                        <p className="opacity-75">
                          {format(event.date, "stringed")}
                        </p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-inactive-tab-text text-center py-3 sm:py-4">
                    No events found matching "{searchQuery}"
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Registrations Section */}
        {selectedEvent && (
          <section className="rounded-lg sm:rounded-xl mb-3 sm:mb-4 md:mb-6 border border-contrast/10 bg-background/60 p-3 sm:p-4 md:p-5 lg:p-6 shadow-sm">
            <div className="flex flex-col gap-2 sm:gap-3">
              <div>
                <h2 className="text-base sm:text-lg md:text-[23px] lg:text-[24px] font-bold text-secondary break-words">
                  {selectedEvent.name} - Registrations
                </h2>
                <p className="text-xs sm:text-sm md:text-[15px] lg:text-[16px] text-inactive-tab-text">
                  {registrationsData?.totalCount || 0} participants registered for this event.
                </p>
              </div>

              {/* Slot Filter */}
              {selectedEvent.slots && selectedEvent.slots.length > 0 && (
                <DropdownMenu
                    label="Filter by Time Slot"
                    options={displayedSlotOptions}
                    value={selectedSlotId}
                    onChange={handleSlotChange}
                    labelClassName="text-xs sm:text-[13px] md:text-[14px] lg:text-[15px] text-gray-600 mb-1"
                />
              )}

              {isLoadingRegistrations ? (
                <div className="flex items-center justify-center py-6 sm:py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-xs sm:text-sm text-inactive-tab-text">Loading registrations...</p>
                  </div>
                </div>
              ) : registrationsData?.items && registrationsData.items.length > 0 ? (
                <>
                  <RegistrationsList registrations={registrationsData.items} />
                  <Pagination
                    currentPage={registrationsData.pageIndex}
                    totalPages={registrationsData.totalPages}
                    onPageChange={(page) => setPageNumber(page)}
                  />
                </>
              ) : (
                <p className="text-center py-6 sm:py-8 text-xs sm:text-sm text-inactive-tab-text">
                  No registrations found for this event.
                </p>
              )}
            </div>
          </section>
        )}
      </div>
    </WithLayout>
  );
}
