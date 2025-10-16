import type { Event } from "@/shared/types/events";

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const eventDate = new Date(event.Date);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = eventDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const availableSlots = event.Capacity - event.RegistrationCount;
  const isFullyBooked = availableSlots <= 0;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
      {/* Category Badge */}
      <div className="flex items-center justify-between mb-3">
        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">
          {event.Category}
        </span>
        {isFullyBooked && (
          <span className="text-xs font-semibold text-red-600">
            Fully Booked
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-contrast mb-2 line-clamp-2">
        {event.Title}
      </h3>

      {/* Description */}
      <p className="text-sm text-secondary mb-4 line-clamp-3">
        {event.Description}
      </p>

      {/* Date & Time */}
      <div className="flex items-center gap-2 mb-3 text-sm text-contrast">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span>
          {formattedDate} at {formattedTime}
        </span>
      </div>

      {/* Capacity Info */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div className="text-sm">
          <span className="text-secondary">
            {event.RegistrationCount}/{event.Capacity} registered
          </span>
        </div>
        {availableSlots > 0 && (
          <span className="text-xs font-medium text-green-600">
            {availableSlots} spots left
          </span>
        )}
      </div>

      {/* Attendee Count (for past events) */}
      {event.AttendeeCount > 0 && (
        <div className="mt-2 text-sm text-secondary">
          <span>{event.AttendeeCount} attended</span>
        </div>
      )}
    </div>
  );
};

export default EventCard;
