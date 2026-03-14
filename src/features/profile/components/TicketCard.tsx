import type { Ticket } from "@/shared/types/profile";
import { useNavigate } from "react-router-dom";
import { LazyImageLoader } from "tccd-ui";
import EVENT_TYPES from "@/constants/EventTypes";
import { MdCalendarMonth } from "react-icons/md";
import format from "@/shared/utils/dateFormater";
import { Button } from "tccd-ui";

export default function TicketCard({ ticket }: { ticket: Ticket }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/tickets/${ticket.event.id}`);
  };

  const statusStyles = () => {
    switch (ticket.status) {
      case "Approved":
        return "bg-green-500/10 text-green-600 border-green-500";
      case "Pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500";
      case "Cancelled":
        return "bg-red-500/30 text-red-700 border-red-500";
        default:
        return "bg-gray-400/10 text-gray-500 border-gray-400";
    }
  };

  return (
    <div
      onClick={handleClick}
      className="relative flex flex-col shadow-md border border-gray-300 rounded-lg w-full lg:h-[320px] md:h-[280px] h-[240px] cursor-pointer bg-background"
    >

      <LazyImageLoader
        src={ticket.event.eventImage}
        alt={ticket.event.name}
        width="100%"
        height="100%"
        className="rounded-lg"
      />
      <div className="bg-background w-full flex-1 pt-2 pb-3 px-3 rounded-b-lg">
        <div className="flex gap-1 items-center">
          <span className="text-primary text-[13px] md:text-[15px] font-semibold">
            {EVENT_TYPES.find((type) => type.value === ticket.event.type)?.label ||
              "Other"}
          </span>
          <span className="text-gray-400">|</span>
          <span className="text-inactive-tab-text text-[12px] md:text-[14px] font-semibold">
            <MdCalendarMonth className="text-inactive-tab-text mr-1 size-3.5 lg:size-4 -mt-1 inline" />
            {format(ticket.event.date, "stringed")}
          </span>
        </div>
        <p className="font-bold text-contrast text-[22px] md:text-[23px] lg:text-[24px] mb-1">
          {ticket.event.name}
        </p>
        <Button
          buttonText="View Details"
          type="secondary"
          width="fit"
          className="md:py-1.5 md:px-4 text-[10px] lg:text-[11px]"
          onClick={handleClick}
        />
      </div>
      <span
        className={`absolute top-2 right-2 inline-flex items-center px-2.5 py-1 shadow-sm border rounded-full text-xs font-medium backdrop-blur-3xl ${statusStyles()}`}
      >
        {ticket.status}
      </span>
    </div>
  );
}
