import type { Ticket } from "@/shared/types/profile";
import { useNavigate } from "react-router-dom";
import { LazyImageLoader } from "tccd-ui";

export default function TicketCard({ ticket }: { ticket: Ticket }) {
  const navigate = useNavigate();
  const statusStyles = () => {
    switch (ticket.status) {
      case "Active":
        return "text-green-800";
      case "Scanned":
        return "text-blue-800";
      case "Expired":
        return "text-gray-800";
      case "Cancelled":
        return "text-red-800";
      default:
        return "";
    }
  };
  return (
    <div
      onClick={() => navigate(`${window.location.origin}/tickets/${ticket.id}`)}
      className="flex items-center m-auto gap-2 lg:gap-3 border-1 border-contrast/13 rounded-lg p-2 w-full h-full cursor-pointer bg-background hover:scale-[102%] transition duration-300 ease-in-out"
    >
      <div className="max-w-[38%] min-w-[38%] xl:max-w-[42%] xl:min-w-[42%] md:block hidden">
        <LazyImageLoader
          src={ticket.eventPoster}
          alt={ticket.eventTitle}
          className="rounded-l-lg"
        />
      </div>
      <div className="md:block hidden w-[2px] bg-gray-300 self-stretch" />
      <div className="flex flex-col space-y-2">
        <h1 className="text-secondary font-bold text-[20px] md:text-[22px] lg:text-[24px] md:mb-2">
          {ticket.eventTitle}
        </h1>
        <>
          <span
            className={`px-3 py-1 text-md lg:text-sm font-medium ${statusStyles()}
            `}
          >
            {ticket.status}
          </span>
        </>
      </div>
    </div>
  );
}
