import React from "react";
import { LazyImageLoader } from "tccd-ui";
import type { TicketStatus } from "@/shared/types/profile";

interface TicketPosterProps {
  posterSrc: string;
  eventTitle: string;
  status: TicketStatus;
}

const TicketPoster: React.FC<TicketPosterProps> = ({
  posterSrc,
  eventTitle,
  status,
}) => {
  const statusStyles = () => {
    switch (status) {
      case "Active":
        return "bg-success/10 text-success border-success";
      case "Scanned":
        return "bg-secondary/10 text-secondary border-secondary";
      case "Expired":
        return "bg-label/10 text-label border-label";
      case "Cancelled":
        return "bg-error/10 text-error border-error";
      default:
        return "";
    }
  };

  return (
    <div className="relative h-48 sm:h-50 md:h-55 overflow-hidden">
      <LazyImageLoader
        src={posterSrc}
        alt={eventTitle}
        className="w-full h-full object-cover"
      />
      <div className="absolute top-4 right-4">
        <span
          className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${statusStyles()}`}
        >
          {status}
        </span>
      </div>
    </div>
  );
};

export default TicketPoster;
