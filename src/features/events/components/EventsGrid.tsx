import type Event from "@/shared/types/events";
import EventCard from "./EventCard";

interface EventsGridProps {
  events: Event[];
  emptyMessage?: string;
}

const EventsGrid = ({
  events,
  emptyMessage = "No events to display.",
}: EventsGridProps) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <p className="text-secondary text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventsGrid;
