import { useState, useCallback } from "react";
import {
  QRCodeScanner,
  ErrorFallback,
  ScannerLoading,
} from "../components";
import { useQRScanner } from "../hooks";
import { QrCode, ArrowLeft, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button, ButtonTypes, ButtonWidths, DropdownMenu } from "tccd-ui";
import ScannerSuccess from "../components/ScannerSuccess";
import { useGetAllUpcomingEvents } from "@/shared/queries/events/eventQueries";
import EventsFilter from "@/features/events/components/EventsFilter";
import EventSelectCard from "../components/EventSelectCard";
import GenericGrid from "@/shared/components/GenericGrid";
import { Pagination } from "@/shared/components/pagination";
import type Event from "@/shared/types/events";
import type { EventQueryParams, EventSlot } from "@/shared/types/events";

export const QRScannerPage = () => {
  const navigate = useNavigate();

  // Step state: "events" or "scanner"
  const [step, setStep] = useState<"events" | "scanner">("events");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");

  // Event query params (same pattern as AdminEventsListPage)
  const [queryParams, setQueryParams] = useState<EventQueryParams>({
    PageNumber: 1,
    PageSize: 6,
  });

  const { data: eventsData, isLoading: eventsLoading } =
    useGetAllUpcomingEvents(queryParams);

  // QR scanner hook – pass the selected slot id
  const {
    isScanning,
    isVerifying,
    scanResult,
    error,
    handleScan,
    handleScanError,
    reset,
  } = useQRScanner(selectedSlotId);

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    setSelectedSlotId("");
    setStep("scanner");
  };

  const handleBackToEvents = () => {
    setStep("events");
    setSelectedEvent(null);
    setSelectedSlotId("");
    reset();
  };

  const handleApplyFilters = useCallback(
    (params: EventQueryParams) => {
      setQueryParams({ ...params, PageNumber: 1 });
    },
    []
  );

  const handlePageChange = useCallback((newPage: number) => {
    setQueryParams((prev) => ({ ...prev, PageNumber: newPage }));
  }, []);

  const formatSlotTime = (slot: EventSlot) => {
    try {
      const start = new Date(slot.startTime).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const end = new Date(slot.endTime).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return `${start} – ${end}`;
    } catch {
      return `${slot.startTime} – ${slot.endTime}`;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="mb-8">
          <div className="text-center flex flex-col gap-2 items-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <QrCode className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              QR Code Scanner
            </h1>
            <p className="text-gray-600">
              {step === "events"
                ? "Select an event to start scanning"
                : "Choose a slot and scan the QR code"}
            </p>
            <Button
              buttonText="Back"
              buttonIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() =>
                step === "scanner" ? handleBackToEvents() : navigate(-1)
              }
              type={ButtonTypes.SECONDARY}
              width={ButtonWidths.FIT}
            />
          </div>
        </header>

        <main>
          {/* ── Step 1: Event Selection ── */}
          {step === "events" && (
            <section className="rounded-xl border border-contrast/10 bg-background/60 p-4 sm:p-5 lg:p-6 shadow-sm">
              <div className="flex flex-col gap-3">
                <div>
                  <h2 className="text-[22px] md:text-[23px] lg:text-[24px] font-bold text-secondary">
                    Select an Event
                  </h2>
                  <p className="text-[14px] md:text-[15px] lg:text-[16px] text-inactive-tab-text">
                    Choose the event you want to scan tickets for.
                  </p>
                </div>
                <EventsFilter
                  searchParams={queryParams}
                  onSearch={handleApplyFilters}
                />
                <hr className="border-t border-gray-400/60 -mt-2 mb-3 shadow-lg" />
              </div>

              {eventsLoading && (
                <div className="flex flex-col items-center justify-center min-h-[50vh] w-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-contrast mx-auto mb-4" />
                    <p className="text-lg text-secondary font-medium">
                      Loading events...
                    </p>
                  </div>
                </div>
              )}

              {!eventsLoading && eventsData && (
                <>
                  {eventsData.items && eventsData.items.length > 0 ? (
                    <>
                      <GenericGrid
                        items={eventsData.items}
                        emptyMessage="No events found."
                        renderCard={(event: Event) => (
                          <EventSelectCard
                            event={event}
                            onSelect={() => handleSelectEvent(event)}
                          />
                        )}
                        gridCols="grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3"
                        getKey={(event: Event) => event.id}
                      />
                      <div className="my-4" />
                      <Pagination
                        currentPage={eventsData.pageIndex}
                        totalPages={eventsData.totalPages}
                        onPageChange={handlePageChange}
                      />
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-secondary font-semibold text-lg">
                        No upcoming events found.
                      </p>
                    </div>
                  )}
                </>
              )}
            </section>
          )}

          {/* ── Step 2: Slot Selection + QR Scanner ── */}
          {step === "scanner" && selectedEvent && (
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              {/* Selected event info */}
              <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <h2 className="font-semibold text-gray-800 text-lg">
                  {selectedEvent.name}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(selectedEvent.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>

              {/* Slot dropdown */}
              {selectedEvent.slots && selectedEvent.slots.length > 0 ? (
                <div className="mb-6">
                  <DropdownMenu
                    label="Select a Slot"
                    placeholder="Choose a slot"
                    options={selectedEvent.slots.map((slot) => ({
                      value: slot.id,
                      label: slot.title
                        ? `${slot.title} (${formatSlotTime(slot)})`
                        : formatSlotTime(slot),
                    }))}
                    value={selectedSlotId}
                    onChange={(value) => {
                      setSelectedSlotId(value);
                      reset();
                    }}
                  />
                </div>
              ) : (
                <p className="mb-6 text-amber-600 text-sm">
                  This event has no slots configured.
                </p>
              )}

              {/* QR Scanner – only show when a slot is selected */}
              {selectedSlotId ? (
                <>
                  {/* Scanning State */}
                  {isScanning && !error && !scanResult && !isVerifying && (
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                      <QRCodeScanner
                        onScan={handleScan}
                        onError={handleScanError}
                      />
                    </div>
                  )}

                  {/* Verifying State */}
                  {isVerifying && <ScannerLoading />}

                  {/* Error State */}
                  {error && !scanResult && (
                    <ErrorFallback error={error.message} onReset={reset} />
                  )}

                  {/* Success State */}
                  {scanResult && !error && !isVerifying && <ScannerSuccess />}
                </>
              ) : (
                selectedEvent.slots &&
                selectedEvent.slots.length > 0 && (
                  <div className="flex items-center justify-center py-12 text-gray-400">
                    <Clock className="w-5 h-5 mr-2" />
                    <span>Please select a slot to start scanning</span>
                  </div>
                )
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
