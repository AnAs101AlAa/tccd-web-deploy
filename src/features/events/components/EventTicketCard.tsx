import React from "react";
import type { Registration } from "@/shared/types/profile";
import TicketPoster from "./TicketPoster";
import AttendeeInfo from "./AttendeeInfo";
import {
  FaCalendar,
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaTag,
  FaClipboardList,
  FaHourglassEnd,
} from "react-icons/fa";
import format from "@/shared/utils/dateFormater";

interface EventTicketCardProps {
  registration: Registration;
  userDetails: {
    englishFullName: string;
    arabicFullName: string;
    phoneNumber: string;
    email: string;
  };
}

const EventTicketCard: React.FC<EventTicketCardProps> = ({
  registration,
  userDetails,
}) => {
  const { event, eventSlot } = registration;

  // Room names as locations
  const roomNames = event.rooms?.map((room) => room.name).filter(Boolean);

  return (
    <div className="w-full max-w-4xl mx-auto bg-background rounded-lg shadow-lg overflow-hidden">
      <TicketPoster
        posterSrc={event.eventImage}
        eventTitle={event.name}
        status={registration.status}
      />

      <div className="p-4 pt-4 sm:p-6 md:p-8">
        {/* Event Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-contrast mb-2">
          {event.name}
        </h1>

        {/* Event Type Badge */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4">
          <FaTag className="w-3 h-3" />
          {event.type}
        </span>

        {/* Description */}
        {event.description && (
          <p className="text-sm sm:text-base text-secondary mb-6 leading-relaxed">
            {event.description}
          </p>
        )}

        {/* Event Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <InfoItem
            icon={<FaCalendar className="w-4 h-4 text-primary" />}
            label="Event Date"
            value={format(event.date, "stringed")}
          />

          {roomNames && roomNames.length > 0 && (
            <InfoItem
              icon={<FaMapMarkerAlt className="w-4 h-4 text-primary" />}
              label="Location"
              value={roomNames.join(", ")}
            />
          )}

          {eventSlot && (
            <InfoItem
              icon={<FaClock className="w-4 h-4 text-primary" />}
              label="Time Slot"
              value={`${format(eventSlot.startTime, "hourFull")} – ${format(eventSlot.endTime, "hourFull")}`}
            />
          )}

          <InfoItem
            icon={<FaHourglassEnd className="w-4 h-4 text-primary" />}
            label="Registration Deadline"
            value={format(event.registrationDeadline, "stringed")}
          />

          <InfoItem
            icon={<FaUsers className="w-4 h-4 text-primary" />}
            label="Capacity"
            value={`${event.registeredCount ?? event.attendeeCount} / ${event.capacity}`}
          />

          <InfoItem
            icon={<FaClipboardList className="w-4 h-4 text-primary" />}
            label="Registered At"
            value={format(registration.registeredAt, "stringed")}
          />
        </div>

        {/* Rooms Section */}
        {event.rooms && event.rooms.length > 0 && (
          <>
            <div className="border-t-2 border-dashed border-gray-300 my-6" />
            <h2 className="text-lg sm:text-xl font-semibold text-secondary mb-3">
              Rooms
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
              {event.rooms.map((room) => (
                <div
                  key={room.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <FaMapMarkerAlt className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-contrast">
                      {room.name}
                    </p>
                    <p className="text-xs text-label">
                      Capacity: {room.capacity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="border-t-2 border-dashed border-gray-300 my-6" />

        {/* Attendee Information */}
        <AttendeeInfo userDetails={userDetails} />
      </div>
    </div>
  );
};

/** Reusable info row */
const InfoItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
    <div className="mt-0.5 shrink-0">{icon}</div>
    <div>
      <p className="text-xs text-label">{label}</p>
      <p className="text-sm font-medium text-contrast">{value}</p>
    </div>
  </div>
);

export default EventTicketCard;
