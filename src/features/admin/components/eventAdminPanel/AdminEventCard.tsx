import type Event from "@/shared/types/events";
import { useNavigate } from "react-router-dom";
import { Button, LazyImageLoader } from "tccd-ui";
import Format from "@/shared/utils/dateFormater";
import { MdCalendarMonth, MdGroups } from "react-icons/md";
import EVENT_TYPES from "@/constants/EventTypes";

export default function AdminEventCard({
  onEdit,
  onDelete,
  event,
}: {
  onEdit: () => void;
  onDelete: () => void;
  event: Event;
}) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/events/${event.id}`)}
      className={`relative flex flex-col items-start m-auto gap-1 lg:gap-2 border-1 border-contrast/13 rounded-lg py-2 px-3 md:p-3 w-full h-full cursor-pointer bg-background hover:scale-[102%] transition duration-300 ease-in-out`}
    >
      <span className="absolute w-fit md:top-5 top-4 left-4 md:left-5 text-white text-xs px-3 py-1 z-20 rounded-2xl bg-secondary">
        {EVENT_TYPES.find((type) => type.value === event.type)?.label ||
          "Other"}
      </span>
      <div className="w-full max-h-[220px] md:max-h-[260px] lg:max-h-[300px]">
        <LazyImageLoader
          src={event.eventImage}
          alt={event.name}
          className="rounded-l-lg aspect-video"
        />
      </div>
      <hr className="w-full border border-gray-200" />
      <div className="flex items-center justify-between">
        <p className="font-bold leading-8 text-[22px] md:text-[24px] lg:text-[27px] mb-1">
          {event.name}
        </p>
      </div>
      <div className="flex flex-row text-inactive-tab-text font-medium text-[13px] md:text-[14px] lg:text-[15px] items-center">
        <MdCalendarMonth className="text-inactive-tab-text mr-1 size-4 lg:size-4.5 -mt-0.5" />
        {Format(event.date, "stringed")}
      </div>
      <div className="-mt-1 flex flex-row text-inactive-tab-text font-medium text-[13px] md:text-[14px] lg:text-[15px] items-center mb-2 md:mb-3">
        <MdGroups className="text-inactive-tab-text mr-1 size-4 lg:size-4.5 -mt-0.5" />
        {event.attendeeCount}
      </div>
      <p className="mt-1 md:mt-2 line-clamp-3 text-[13px] md:text-[14px] lg:text-[15px]">
        {event.description}
      </p>
      <div className="flex flex-1 items-end gap-3 mt-4">
        <Button
          buttonText="Edit"
          type="secondary"
          width="small"
          onClick={() => {
            onEdit();
          }}
        />
        <Button
          buttonText="Delete"
          type="danger"
          width="small"
          onClick={() => {
            onDelete();
          }}
        />
      </div>
    </div>
  );
}
