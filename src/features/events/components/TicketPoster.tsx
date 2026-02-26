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
      case "Approved":
        return "bg-green-500/10 text-green-600 border-green-500";
      case "Pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500";
      case "Rejected":
        return "bg-red-500/10 text-red-600 border-red-500";
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
