import { useState } from "react";
import { useGetAllEvents } from "@/shared/queries/events";
import { Pagination } from "@/shared/components/pagination";
import type Event from "@/shared/types/events";
import type { EventQueryParams } from "@/shared/types/events";

interface EventsStatisticsTableProps {
  onEventSelect: (event: Event) => void;
}

const EventsStatisticsTable = ({
  onEventSelect,
}: EventsStatisticsTableProps) => {
  const [queryParams, setQueryParams] = useState<EventQueryParams>({
    PageNumber: 1,
    PageSize: 10,
  });

  const { data, isLoading } = useGetAllEvents(queryParams);

  const handlePageChange = (newPage: number) => {
    setQueryParams((prev) => ({ ...prev, PageNumber: newPage }));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-contrast mx-auto mb-3" />
          <p className="text-secondary font-medium">Loading events...</p>
        </div>
      </div>
    );
  }

  const events = data?.items || [];

  if (events.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-secondary font-semibold text-lg">No events found.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-contrast/5">
            <tr>
              <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-inactive-tab-text">
                Event Name
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-inactive-tab-text">
                Date
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-inactive-tab-text">
                Type
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-inactive-tab-text">
                Registered
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-inactive-tab-text">
                Attended
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-inactive-tab-text">
                Capacity
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-contrast/10">
            {events.map((event) => (
              <tr
                key={event.id}
                onClick={() => onEventSelect(event)}
                className="hover:bg-contrast/5 transition-colors cursor-pointer"
              >
                <td className="px-4 py-3">
                  <span className="font-medium text-contrast">
                    {event.name}
                  </span>
                </td>
                <td className="px-4 py-3 text-secondary whitespace-nowrap">
                  {formatDate(event.date)}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-contrast/10 text-contrast">
                    {event.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-secondary font-medium">
                  {event.registeredCount}
                </td>
                <td className="px-4 py-3 text-secondary font-medium">
                  {event.attendeeCount}
                </td>
                <td className="px-4 py-3 text-secondary font-medium">
                  {event.capacity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-contrast/10">
        {events.map((event) => (
          <div
            key={event.id}
            onClick={() => onEventSelect(event)}
            className="p-4 space-y-3 hover:bg-contrast/5 transition-colors cursor-pointer active:bg-contrast/10"
          >
            <div className="flex justify-between items-start">
              <p className="font-semibold text-contrast text-[18px]">
                {event.name}
              </p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-contrast/10 text-contrast shrink-0 ml-2">
                {event.type}
              </span>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <span className="font-medium text-inactive-tab-text block mb-0.5">
                  Date
                </span>
                <span className="text-secondary">{formatDate(event.date)}</span>
              </div>
              <div>
                <span className="font-medium text-inactive-tab-text block mb-0.5">
                  Registered
                </span>
                <span className="text-secondary">{event.registeredCount}</span>
              </div>
              <div>
                <span className="font-medium text-inactive-tab-text block mb-0.5">
                  Attended
                </span>
                <span className="text-secondary">{event.attendeeCount}</span>
              </div>
              <div>
                <span className="font-medium text-inactive-tab-text block mb-0.5">
                  Capacity
                </span>
                <span className="text-secondary">{event.capacity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <Pagination
          currentPage={data.pageIndex}
          totalPages={data.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default EventsStatisticsTable;
