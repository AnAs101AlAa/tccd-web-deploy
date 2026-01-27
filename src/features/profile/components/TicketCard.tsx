import type { Ticket } from "@/shared/types/profile";
import { useNavigate } from "react-router-dom";
import { LazyImageLoader } from "tccd-ui";
import { FaCalendar } from "react-icons/fa";
import format from "@/shared/utils/dateFormater";

export default function TicketCard({ ticket }: { ticket: Ticket }) {
  const navigate = useNavigate();
  const statusStyles = () => {
    switch (ticket.status) {
      case "Active":
        return "bg-green-600/40 text-green-600";
      case "Scanned":
        return "bg-secondary/30 text-secondary";
      case "Expired":
        return "bg-gray-600/30 text-gray-600";
      case "Cancelled":
        return "bg-primary/30 text-primary";
      default:
        return "";
    }
  };
  return (
    <div onClick={() => navigate(`/tickets/${ticket.id}`)} className="relative flex items-center m-auto gap-2 lg:gap-3 border-1 border-gray-300 rounded-lg w-full lg:h-[320px] md:h-[280px] h-[240px] cursor-pointer bg-background hover:scale-[102%] transition duration-300 ease-in-out">
      <div className="absolute top-0 left-0 inset-0 rounded-lg">
        <LazyImageLoader
          src={ticket.eventPoster}
          alt={ticket.eventTitle}
          width="100%"
          height="100%"
          className="rounded-lg"
        />
      </div>
      <div className="bg-background w-full absolute bottom-0 p-4 border-t border-gray-200 rounded-b-lg pb-5">
        <p className="text-secondary font-bold text-[20px] md:text-[21px] lg:text-[23px] md:mb-2">
          {ticket.eventTitle}
        </p>
        <div className="flex items-center gap-2">
          <FaCalendar className="size-4 text-primary"/>
          <p className="text-contrast text-[11px] md:text-[12px] lg:text-[13px]">{format(ticket.eventDate, "stringed")}</p>
        </div>
      </div>
      <span className={`absolute top-2 right-2 px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full font-medium ${statusStyles()} !text-white`}>
        {ticket.status}
      </span>
    </div>
  );
}
