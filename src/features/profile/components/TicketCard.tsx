import type { Ticket } from "@/shared/types/profile";
import { useNavigate } from "react-router-dom";
import { LazyImageLoader } from "tccd-ui";
import { FaCalendar } from "react-icons/fa";
import format from "@/shared/utils/dateFormater";

export default function TicketCard({ ticket }: { ticket: Ticket }) {
  const navigate = useNavigate();
  const statusStyles = () => {
    switch (ticket.status) {
      case "Approved":
        return "bg-green-500";
      case "Pending":
        return "bg-yellow-500";
      case "Rejected":
        return "bg-primary";
      default:
        return "";
    }
  };
  return (
    <div
      onClick={() => navigate(`/tickets/${ticket.eventSlotId}`)}
      className="relative flex items-center m-auto gap-2 lg:gap-3 border-1 border-gray-300 rounded-lg w-full lg:h-[320px] md:h-[280px] h-[240px] cursor-pointer bg-background hover:scale-[102%] transition duration-300 ease-in-out"
    >
      <div className="absolute top-0 left-0 inset-0 rounded-lg">
        <LazyImageLoader
          src={ticket.event.eventImage}
          alt={ticket.event.name}
          width="100%"
          height="100%"
          className="rounded-lg"
        />
      </div>
      <div className="bg-background w-full absolute bottom-0 p-4 border-t border-gray-200 rounded-b-lg pb-5">
        <p className="text-secondary font-bold text-[20px] md:text-[21px] lg:text-[23px] md:mb-2">
          {ticket.event.name}
        </p>
        <div className="flex items-center gap-2">
          <FaCalendar className="size-4 text-primary" />
          <p className="text-contrast text-[11px] md:text-[12px] lg:text-[13px]">
            {format(ticket.event.date, "stringed")}
          </p>
        </div>
      </div>
      <span
        className={`absolute top-2 right-2 px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full font-medium ${statusStyles()} text-white!`}
      >
        {ticket.status}
      </span>
    </div>
  );
}
