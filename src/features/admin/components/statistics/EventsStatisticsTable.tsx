import { useState } from "react";
import { useGetAllEvents } from "@/shared/queries/events";
import { Pagination } from "@/shared/components/pagination";
import type Event from "@/shared/types/events";
import type { EventQueryParams } from "@/shared/types/events";
import EVENT_TYPES from "@/constants/EventTypes";
import format from "@/shared/utils/dateFormater";
import { FiChevronRight } from "react-icons/fi";

interface EventsStatisticsTableProps {
  onEventSelect: (event: Event) => void;
}

const getCapacity = (event: Event) => {
  if (event.slots?.length) {
    return event.slots.reduce((total, slot) => total + (slot.capacity || 0), 0);
  }
  return 0;
};

const getEventTypeLabel = (type: string) => {
  return (
    EVENT_TYPES.find((eventType) => eventType.value === type)?.label || type
  );
};

/*Skeleton Loaders */

const TableSkeleton = () => (
  <div>
    {/* Desktop Table Skeleton */}
    <div className="hidden lg:block">
      <div className="bg-contrast/5 rounded-lg px-4 py-3 flex gap-4 mb-1">
        {["w-48", "w-28", "w-24", "w-20", "w-20", "w-20"].map((w, i) => (
          <div
            key={i}
            className={`h-4 ${w} bg-contrast/10 rounded animate-pulse`}
          />
        ))}
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex gap-4 px-4 py-4 border-b border-contrast/5"
          style={{ animationDelay: `${i * 75}ms` }}
        >
          <div className="h-4 w-48 bg-contrast/8 rounded animate-pulse" />
          <div className="h-4 w-28 bg-contrast/6 rounded animate-pulse" />
          <div className="h-6 w-24 bg-contrast/8 rounded-full animate-pulse" />
          <div className="h-4 w-20 bg-contrast/6 rounded animate-pulse" />
          <div className="h-4 w-20 bg-contrast/6 rounded animate-pulse" />
          <div className="h-4 w-20 bg-contrast/6 rounded animate-pulse" />
        </div>
      ))}
    </div>

    {/* Mobile Card Skeleton */}
    <div className="lg:hidden divide-y divide-contrast/5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-5 space-y-3 animate-pulse">
          <div className="flex justify-between items-start">
            <div className="h-5 w-40 bg-contrast/10 rounded" />
            <div className="h-6 w-20 bg-contrast/8 rounded-full" />
          </div>
          <div className="flex flex-wrap gap-6">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="flex flex-col gap-1.5">
                <div className="h-3 w-16 bg-contrast/6 rounded" />
                <div className="h-4 w-12 bg-contrast/8 rounded" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

/*Main Component*/

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

  if (isLoading) {
    return <TableSkeleton />;
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
          <thead className="bg-contrast/5 rounded-lg">
            <tr>
              <th className="whitespace-nowrap px-4 py-3.5 text-left text-sm font-semibold text-inactive-tab-text tracking-wide uppercase">
                Event Name
              </th>
              <th className="whitespace-nowrap px-4 py-3.5 text-left text-sm font-semibold text-inactive-tab-text tracking-wide uppercase">
                Date
              </th>
              <th className="whitespace-nowrap px-4 py-3.5 text-left text-sm font-semibold text-inactive-tab-text tracking-wide uppercase">
                Type
              </th>
              <th className="whitespace-nowrap px-4 py-3.5 text-left text-sm font-semibold text-inactive-tab-text tracking-wide uppercase">
                Registered
              </th>
              <th className="whitespace-nowrap px-4 py-3.5 text-left text-sm font-semibold text-inactive-tab-text tracking-wide uppercase">
                Attended
              </th>
              <th className="whitespace-nowrap px-4 py-3.5 text-left text-sm font-semibold text-inactive-tab-text tracking-wide uppercase">
                Capacity
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-contrast/10">
            {events.map((event) => {
              const registeredCount = event.registrationCount ?? 0;

              return (
                <tr
                  key={event.id}
                  onClick={() => onEventSelect(event)}
                  className="hover:bg-contrast/5 transition-all duration-200 cursor-pointer group"
                >
                  <td className="px-4 py-3.5">
                    <span className="font-semibold text-contrast group-hover:text-primary transition-colors">
                      {event.name}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-secondary whitespace-nowrap">
                    {format(event.date, "stringed")}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-contrast/5 text-contrast border border-contrast/10">
                      {getEventTypeLabel(event.type)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-secondary font-semibold tabular-nums">
                    {registeredCount}
                  </td>
                  <td className="px-4 py-3.5 text-secondary font-semibold tabular-nums">
                    {event.attendeeCount}
                  </td>
                  <td className="px-4 py-3.5 text-secondary font-semibold tabular-nums">
                    {getCapacity(event)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-contrast/10">
        {events.map((event) => {
          const registeredCount = event.registrationCount ?? 0;

          return (
            <div
              key={event.id}
              onClick={() => onEventSelect(event)}
              className="p-5 space-y-3 hover:bg-contrast/5 transition-all duration-200 cursor-pointer active:bg-contrast/10 active:scale-[0.99] group"
            >
              <div className="flex justify-between items-start gap-3">
                <p className="font-semibold text-contrast text-[17px] group-hover:text-primary transition-colors flex-1">
                  {event.name}
                </p>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-contrast/5 text-contrast border border-contrast/10">
                    {getEventTypeLabel(event.type)}
                  </span>
                  <FiChevronRight className="text-inactive-tab-text w-4 h-4" />
                </div>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <div className="min-w-[80px]">
                  <span className="font-medium text-inactive-tab-text block mb-0.5 text-xs uppercase tracking-wider">
                    Date
                  </span>
                  <span className="text-secondary font-medium">
                    {format(event.date, "stringed")}
                  </span>
                </div>
                <div className="min-w-[70px]">
                  <span className="font-medium text-inactive-tab-text block mb-0.5 text-xs uppercase tracking-wider">
                    Registered
                  </span>
                  <span className="text-secondary font-semibold tabular-nums">
                    {registeredCount}
                  </span>
                </div>
                <div className="min-w-[70px]">
                  <span className="font-medium text-inactive-tab-text block mb-0.5 text-xs uppercase tracking-wider">
                    Attended
                  </span>
                  <span className="text-secondary font-semibold tabular-nums">
                    {event.attendeeCount}
                  </span>
                </div>
                <div className="min-w-[70px]">
                  <span className="font-medium text-inactive-tab-text block mb-0.5 text-xs uppercase tracking-wider">
                    Capacity
                  </span>
                  <span className="text-secondary font-semibold tabular-nums">
                    {getCapacity(event)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
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
