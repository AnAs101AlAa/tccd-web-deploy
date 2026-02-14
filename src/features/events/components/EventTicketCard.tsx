import React from "react";
import type { Ticket } from "@/shared/types/profile";
import TicketPoster from "./TicketPoster";
import AttendeeInfo from "./AttendeeInfo";
import TicketQRCode from "./TicketQRCode";

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
        posterSrc={ticket.eventPoster}
        eventTitle={ticket.eventTitle}
        status={ticket.status}
      />

      <div className="p-4 pt-2 sm:pt-2 sm:p-4 md:p-8 md:pt-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-contrast mb-6">
          {ticket.eventTitle}
        </h1>

        <div className="border-t-2 border-dashed border-gray-300 my-6"/>

        <AttendeeInfo userDetails={userDetails} />

        <div className="border-t-2 border-dashed border-gray-300 my-6"/>

        <TicketQRCode
          qrCodeSrc={ticket.qrCode}
          eventTitle={ticket.eventTitle}
        />

        <div className="mt-6 text-center">
          <p className="text-xs text-label">Ticket ID</p>
          <p className="text-sm font-mono text-contrast">#{ticket.id}</p>
        </div>
      </div>
    </div>
  );
};

export default EventTicketCard;
