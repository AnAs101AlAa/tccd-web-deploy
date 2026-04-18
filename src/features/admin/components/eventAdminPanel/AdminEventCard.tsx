import type Event from "@/shared/types/events";
import { useNavigate } from "react-router-dom";
import { Button, LazyImageLoader } from "tccd-ui";
import format from "@/shared/utils/dateFormater";
import { MdCalendarMonth, MdGroups } from "react-icons/md";
import EVENT_TYPES from "@/constants/EventTypes";
import { HTMLFormattedText } from "@/shared/components/HTMLFormattedText";
import { useApproveEvent } from "@/shared/queries/admin/events/eventsQueries";
import Toggle from "@/shared/components/customComponents/Toggle";

export default function AdminEventCard({
  onEdit,
  event,
  onDelete,
}: {
  onDelete: () => void;
  onEdit: () => void;
  event: Event;
}) {
  const navigate = useNavigate();
  const approveMutation = useApproveEvent();

  const handleToggleApproval = (newState: boolean) => {
    approveMutation.mutate({ eventId: event.id, isApproved: newState });
  };

  return (
      <div
        onClick={() => navigate(`/events/${event.id}`)}
        className={`relative flex flex-col items-start m-auto gap-1 lg:gap-2 border border-contrast/13 rounded-lg py-2 px-3 md:p-3 w-full h-full cursor-pointer bg-background hover:scale-[102%] transition duration-300 ease-in-out`}
      >
        <span className="absolute w-fit md:top-5 top-4 left-4 md:left-5 text-white text-xs px-3 py-1 z-20 rounded-2xl bg-secondary">
          {EVENT_TYPES.find((type) => type.value === event.type)?.label ||
            "Other"}
        </span>
        <div className="w-full h-52.5 md:h-61.25 lg:h-70">
          <LazyImageLoader
            src={event.eventImage}
            alt={event.name}
            height={"100%"}
            className="rounded-lg aspect-video "
          />
        </div>
        <hr className="w-full border border-gray-200" />
        <p className="font-bold leading-8 text-[22px] md:text-[23px] lg:text-[24px]">
          {event.name}
        </p>
        <div className="flex items-center text-[13px] md:text-[14px] font-semibold text-inactive-tab-text">
          <div className="flex flex-row items-center">
            <MdCalendarMonth className=" mr-1 size-4 lg:size-4.5 -mt-0.5" />
            {format(event.date, "stringed")}
          </div>
          <span className="mx-1.5 text-inactive-tab-text">|</span>
          <div className="flex flex-row items-center">
            <MdGroups className=" mr-1 size-4 lg:size-4.5 -mt-0.5" />
            {event.attendeeCount}
          </div>

        </div>
        <p className="line-clamp-3 text-[13px] md:text-[14px] lg:text-[15px]">
          <HTMLFormattedText content={event.description} />
        </p>
        <div
          className="flex flex-1 flex-wrap items-end gap-3 mt-4 w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            buttonText="Edit"
            type="secondary"
            width="small"
            className="md:py-2"
            onClick={() => onEdit()}
          />
          <Button
            buttonText="Delete"
            type="danger"
            width="small"
            onClick={() => onDelete()}
          />
            <div className="ml-auto flex items-center pr-2">
              <Toggle 
                initial={event.isApproved} 
                label={event.isApproved ? "Approved" : "Disapproved"} 
                disabled={approveMutation.isPending}
                onToggle={handleToggleApproval} 
              />
            </div>
        </div>
      </div>
  );
}
