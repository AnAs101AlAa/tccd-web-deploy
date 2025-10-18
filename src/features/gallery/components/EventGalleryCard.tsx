import type { EventGalleryCardProps } from "@/shared/types";
import Format from "@/shared/utils/dateFormater";
import { LazyImageLoader } from "tccd-ui";
import { useNavigate } from "react-router-dom";
export const EventGalleryCard = ({
    id,
    eventName,
    eventType,
    eventPoster,
    eventDescription,
    eventDate,
}: EventGalleryCardProps) => {
    const navigator = useNavigate();
    const handleCardClick = () => {
        navigator(`/gallery/view/${id}`);
    };

    return (
        <div
            id={id}
            onClick={handleCardClick}
            className="w-full rounded-2xl overflow-hidden shadow-lg hover:scale-[102%] cursor-pointer transition-all duration-300 bg-white h-full"
        >
            <LazyImageLoader
                src={eventPoster}
                alt={eventName}
                className="w-full"
                height="16rem"
            />

            <div className="p-3 space-y-1">
                <div className="flex gap-1 items-center">
                    <span className="text-primary text-[13px] md:text-[15px] font-semibold">
                        {eventType}
                    </span>
                    <span className="text-gray-400">|</span>
                    <span className="text-inactive-tab-text text-[12px] md:text-[14px] font-semibold">
                        {Format(eventDate, "stringed")}
                    </span>
                </div>
                <h2 className="text-[20px] md:text-[24px] font-bold text-gray-800 mb-2">
                    {eventName}
                </h2>
                <p className="text-gray-600 text-[13px] md:text-[15px] line-clamp-3">
                    {eventDescription}
                </p>
            </div>
        </div>
    );
};

export default EventGalleryCard;
