import type Event from "@/shared/types/events";
import { FaRegUser } from "react-icons/fa6";
import { MdCalendarMonth } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { LazyImageLoader } from "tccd-ui";
import Format from "@/shared/utils/dateFormater";

export default function PastEventCard({ event }: { event: Event }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/events/${event.id}`)}
      className="flex items-center m-auto gap-2 lg:gap-3 border-1 border-contrast/13 rounded-lg p-2 w-full h-full cursor-pointer bg-background hover:scale-[102%] transition duration-300 ease-in-out"
    >
      <div className="max-w-[38%] min-w-[38%] xl:max-w-[42%] xl:min-w-[42%] md:block hidden">
        <LazyImageLoader 
          src={event.eventPoster}
          alt={event.title}
          className="rounded-l-lg"
        />
      </div>
      <div className="md:block hidden w-[2px] bg-gray-300 self-stretch" />
      <div className="flex flex-col space-y-2">
        <h1 className="text-secondary font-bold text-[20px] md:text-[22px] lg:text-[24px] md:mb-2">
          {event.title}
        </h1>
        <>
          <div className="flex flex-row text-inactive-tab-text font-medium text-[13px] md:text-[14px] lg:text-[15px] items-center">
            <MdCalendarMonth className="text-inactive-tab-text mr-1 size-4.5 lg:size-5 -mt-0.5" />
            {Format(event.date, "stringed")}
          </div>
        </>
        <>
          <span className="flex flex-row text-inactive-tab-text font-medium text-[13px] md:text-[14px] lg:text-[15px] items-center">
            <FaRegUser className="text-inactive-tab-text mr-1 size-4 lg:size-4.5 -mt-0.5" />
            {event.attendeeCount}
          </span>
        </>
        <p className="mt-1 md:mt-2 line-clamp-3 text-[13px] md:text-[14px] lg:text-[15px]">
          {event.description}
        </p>
      </div>
    </div>
  );
}
