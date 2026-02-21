import React from "react";
import type { Ticket } from "@/shared/types/profile";
import TicketPoster from "./TicketPoster";
import AttendeeInfo from "./AttendeeInfo";
import { FaCalendar, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import format from "@/shared/utils/dateFormater";

interface EventTicketCardProps {
  ticket: Ticket;
  userDetails: {
    englishFullName: string;
    arabicFullName: string;
    phoneNumber: string;
    email: string;
  };
}

const EventTicketCard: React.FC<EventTicketCardProps> = ({
  ticket,
  userDetails,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-background rounded-lg shadow-lg overflow-hidden">
      <TicketPoster
        posterSrc={ticket.event.eventImage}
        eventTitle={ticket.event.name}
        status={ticket.status}
      />

      <div className="p-4 pt-2 sm:pt-2 sm:p-4 md:p-8 md:pt-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-contrast mb-4">
          {ticket.event.name}
        </h1>

        {/* Event Details */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2 text-secondary">
            <FaCalendar className="w-4 h-4 text-primary" />
            <span className="text-sm">
              {format(ticket.event.date, "stringed")}
            </span>
          </div>

          {ticket.event.locations && ticket.event.locations.length > 0 && (
            <div className="flex items-center gap-2 text-secondary">
              <FaMapMarkerAlt className="w-4 h-4 text-primary" />
              <span className="text-sm">
                {ticket.event.locations.join(", ")}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 text-secondary">
            <FaClock className="w-4 h-4 text-primary" />
            <span className="text-sm">
              Registered {format(ticket.registeredAt, "stringed")}
            </span>
          </div>
        </div>

        <div className="border-t-2 border-dashed border-gray-300 my-6" />

        <AttendeeInfo userDetails={userDetails} />

        <div className="border-t-2 border-dashed border-gray-300 my-6" />

        <div className="mt-6 text-center">
          <p className="text-xs text-label">Slot ID</p>
          <p className="text-sm font-mono text-contrast">
            #{ticket.eventSlotId}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventTicketCard;
