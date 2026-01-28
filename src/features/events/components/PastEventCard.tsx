import type Event from "@/shared/types/events";
import { MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Button, LazyImageLoader } from "tccd-ui";
import Format from "@/shared/utils/dateFormater";
import { MdCalendarMonth, MdImage, MdGroups } from "react-icons/md";
import EVENT_TYPES from "@/constants/EventTypes";

export default function PastEventCard({
  event,
  canEdit,
  onEdit = () => {},
}: {
  event: Event;
  canEdit?: boolean;
  onEdit?: (event: Event) => void;
}) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/events/${event.id}`)}
      className="relative flex items-start m-auto gap-2 lg:gap-3 border-1 border-contrast/13 rounded-lg py-2 px-3 md:p-3 w-full h-full cursor-pointer bg-background hover:scale-[102%] transition duration-300 ease-in-out"
    >
      <span className="absolute w-fit md:top-5 top-2 right-2 md:left-5 text-white text-xs px-3 py-1 z-20 rounded-2xl bg-secondary">
        {EVENT_TYPES.find((type) => type.value === event.type)?.label ||
          "Other"}
      </span>
      <div className="max-w-[38%] min-w-[38%] xl:max-w-[42%] xl:min-w-[42%] md:block hidden">
        {event.eventImage ? (
          <LazyImageLoader
            src={event.eventImage}
            alt={event.name}
            className="rounded-l-lg"
          />
        ) : (
          <div className="w-full h-full aspect-[4/3] flex items-center justify-center bg-gray-100 rounded-l-lg">
            <MdImage className="text-gray-400 text-5xl lg:text-6xl" />
          </div>
        )}
      </div>
      <div className="md:block hidden w-[2px] bg-gray-300 self-stretch" />
      <div>
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-between"
        >
          <p className="font-bold text-[#285D7E] text-[22px] md:text-[24px] lg:text-[27px] mb-1">
            {event.name}
          </p>

          {canEdit && (
            <Button
              buttonText=""
              buttonIcon={<MdEdit className="text-[18px] md:text-[20px]" />}
              type="ghost"
              onClick={() => {
                onEdit(event);
              }}
            />
          )}
        </div>
        <>
          <div className="flex flex-row text-inactive-tab-text font-medium text-[13px] md:text-[14px] lg:text-[15px] items-center">
            <MdCalendarMonth className="text-inactive-tab-text mr-1 size-4 lg:size-4.5 -mt-0.5" />
            {Format(event.date, "stringed")}
          </div>
        </>
        <>
          <span className="flex flex-row text-inactive-tab-text font-medium text-[13px] md:text-[14px] lg:text-[15px] items-center mb-2 md:mb-3">
            <MdGroups className="text-inactive-tab-text mr-1 size-4 lg:size-4.5 -mt-0.5" />
            {event.attendeeCount}
          </span>
        </>
        <p className="mt-1 md:mt-2 line-clamp-3 text-[14px] md:text-[15px] lg:text-[16px]">
          {event.description}
        </p>
      </div>
    </div>
  );
}
