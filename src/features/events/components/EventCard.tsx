import type Event from "@/shared/types/events";

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 h-full flex items-center justify-center">
      <h3 className="text-xl font-bold text-contrast text-center">
        {event.title}
      </h3>
    </div>
  );
};

export default EventCard;
