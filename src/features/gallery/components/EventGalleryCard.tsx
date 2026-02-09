import Format from "@/shared/utils/dateFormater";
import { LazyImageLoader } from "tccd-ui";
import { useNavigate } from "react-router-dom";
import type Event from "@/shared/types/events";
import EVENT_TYPES from "@/constants/EventTypes";

export const EventGalleryCard = (event: Event) => {
    const navigator = useNavigate();
    const handleCardClick = () => {
        navigator(`/gallery/view/${event.id}`);
    };

    return (
        <div
            id={event.id}
            onClick={handleCardClick}
            className="w-full rounded-lg overflow-hidden shadow-lg hover:scale-[102%] cursor-pointer transition-all duration-300 bg-white h-full"
        >
            <LazyImageLoader
                src={event.eventImage}
                alt={event.name}
                className="w-full"
                height="16rem"
            />

            <div className="p-3 space-y-1">
                <div className="flex gap-1 items-center">
                    <span className="text-primary text-[13px] md:text-[15px] font-semibold">
                        {EVENT_TYPES.find((type) => type.value === event.type)?.label ||
                            "Other"}
                    </span>
                    <span className="text-gray-400">|</span>
                    <span className="text-inactive-tab-text text-[12px] md:text-[14px] font-semibold">
                        {Format(event.date, "stringed")}
                    </span>
                </div>
                <h2 className="text-[20px] md:text-[24px] font-bold text-gray-800 mb-2">
                    {event.name}
                </h2>
                <p className="text-gray-600 text-[13px] md:text-[15px] line-clamp-3">
                    {event.description}
                </p>
            </div>
        </div>
    );
};

export default EventGalleryCard;
