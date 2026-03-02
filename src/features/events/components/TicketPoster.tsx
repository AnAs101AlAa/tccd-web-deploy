import React from "react";
import type { TicketStatus } from "@/shared/types/profile";

interface TicketPosterProps {
  eventTitle: string;
  status: TicketStatus;
}

const TicketPoster: React.FC<TicketPosterProps> = ({ eventTitle, status }) => {
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
    <div className="relative flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 border-b border-gray-200 min-h-36 sm:min-h-44 md:min-h-52 px-6 py-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-contrast text-center leading-tight">
        {eventTitle}
      </h1>
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
