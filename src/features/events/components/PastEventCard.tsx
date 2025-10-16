import type Event from "@/shared/types/events";
import { FaRegUser } from "react-icons/fa6";
import { MdCalendarMonth } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function PastEventCard(event: Event) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`${window.location.origin}/events/${event.id}`)}
      className="flex flex-row border-1 border-contrast/13 rounded-lg p-2 cursor-pointer bg-background hover:bg-background-contrast transition duration-300 ease-in-out hover:border-primary h-full"
    >
      <img
        src={event.image}
        alt={event.title}
        className="w-4/12 h-auto object-cover rounded-lg mr-2"
      />
      <div className="flex flex-col">
        <h1 className="text-secondary font-bold text-xl lg:text-2xl mb-4">
          {event.title}
        </h1>
        <>
          <span className="flex flex-row text-inactive-tab-text font-medium text-sm lg:text-base">
            <FaRegUser className="text-inactive-tab-text mr-1 text-base lg:text-xl" />
            : {event.attendeeCount}
          </span>
        </>
        <>
          <span className="flex flex-row text-inactive-tab-text font-medium text-sm lg:text-base">
            <MdCalendarMonth className="text-inactive-tab-text mr-1 text-base lg:text-xl" />
            : {event.date.toLocaleDateString("en-GB", options)}
          </span>
        </>
        <p className="mt-4 line-clamp-2 text-sm lg:text-base">
          {event.description}
        </p>
      </div>
    </div>
  );
}
