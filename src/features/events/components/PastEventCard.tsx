import type Event from "@/shared/types/events";
import { useNavigate } from "react-router-dom";
import { LazyImageLoader } from "tccd-ui";
import { MdCalendarMonth, MdGroups } from "react-icons/md";
import EVENT_TYPES from "@/constants/EventTypes";
import format from "@/shared/utils/dateFormater";

export default function AdminEventCard({
  event,
}: {
  event: Event;
}) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/events/${event.id}`)}
      className={`relative flex flex-col items-start m-auto gap-1 lg:gap-2 border-1 border-contrast/13 rounded-lg py-2 px-3 md:p-3 w-full h-full cursor-pointer bg-background hover:scale-[102%] transition duration-300 ease-in-out`}
    >
      <div className="w-full max-h-[240px] md:max-h-[290px] lg:max-h-[320px]">
          <LazyImageLoader
            src={event.eventImage}
            alt={event.name}
            className="rounded-l-lg aspect-video object-top"
          />
      </div>
      <hr className="w-full border border-gray-200" />
      <div className="flex gap-1 items-center">
          <span className="text-primary text-[13px] md:text-[15px] font-semibold">
              {EVENT_TYPES.find((type) => type.value === event.type)?.label ||
                "Other"}
          </span>
          <span className="text-gray-400">|</span>
          <span className="text-inactive-tab-text text-[12px] md:text-[14px] font-semibold">
              <MdCalendarMonth className="text-inactive-tab-text mr-1 size-3.5 lg:size-4 -mt-1 inline" />
              {format(event.date, "stringed")}
          </span>
      </div>
      <div className="flex items-center justify-between -mt-1.5">
        <p className="font-bold leading-8 text-[22px] md:text-[23px] lg:text-[24px] mb-1">
          {event.name}
        </p>
      </div>
        <div className="-mt-2 flex flex-row text-inactive-tab-text font-medium text-[14px] md:text-[15px] lg:text-[16px] items-center">
          <MdGroups className="text-inactive-tab-text mr-1 size-4 lg:size-4.5 -mt-0.5" />
          {event.attendeeCount}
        </div>
      <p className="mt-1 line-clamp-3 text-[14px] md:text-[15px] lg:text-[16px]">
        {event.description}
      </p>
    </div>
  );
}
