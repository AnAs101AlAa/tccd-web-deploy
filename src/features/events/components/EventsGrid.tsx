import type Event from "@/shared/types/events";
import EventCard from "./EventCard";
import type { ReactNode } from "react";

interface EventsGridProps {
  events: Event[];
  emptyMessage?: string;
  renderCard?: (event: Event) => ReactNode;
  gridCols?: string;
}

const EventsGrid = ({
  events,
  emptyMessage = "No events to display.",
  renderCard,
  gridCols = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
}: EventsGridProps) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <p className="text-secondary text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols} gap-6`}>
      {events.map((event) =>
        renderCard ? (
          <div key={event.id} className="h-full">
            {renderCard(event)}
          </div>
        ) : (
          <EventCard key={event.id} event={event} />
        )
      )}
    </div>
  );
};

export default EventsGrid;
